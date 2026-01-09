import { useState, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "../../utils/axios";
import { SHOE_CATEGORIES, SHOE_SIZES } from "../../utils/config";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    color: "",
    images: [],
    sizes: SHOE_SIZES.map((size) => ({ size, stock: 0 })),
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get("/admin/products");

      const safeProducts = Array.isArray(data?.data?.products)
        ? data.data.products
        : [];

      setProducts(safeProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORM HANDLERS =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size, stock) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.size === size ? { ...s, stock: Number(stock) || 0 } : s
      ),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("images", file));

    try {
      const { data } = await axios.post("/admin/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const urls = Array.isArray(data?.urls) ? data.urls : [];

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err) {
      console.error("Error uploading images:", err);
      toast.error("Failed to upload images");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    try {
      if (editingProduct?._id) {
        await axios.put(`/admin/products/${editingProduct._id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await axios.post("/admin/products", payload);
        toast.success("Product created successfully");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData(initialFormState);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(err?.response?.data?.message || "Failed to save product");
    }
  };

  // ================= EDIT / DELETE =================
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product?.name || "",
      brand: product?.brand || "",
      description: product?.description || "",
      price: product?.price ?? "",
      category: product?.category || "",
      color: product?.color || "",
      images: Array.isArray(product?.images) ? product.images : [],
      sizes: SHOE_SIZES.map((size) => {
        const found = product?.sizes?.find((s) => s.size === size);
        return { size, stock: found?.stock || 0 };
      }),
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/admin/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // ================= STATES =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button onClick={fetchProducts} className="mt-4 btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Products
        </h1>
        <button
          onClick={openModal}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Total Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const totalStock = Array.isArray(product?.sizes)
                ? product.sizes.reduce((t, s) => t + (s?.stock || 0), 0)
                : 0;

              return (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product?.images?.[0] || "/placeholder.png"}
                        alt={product?.name || "Product"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium">
                          {product?.name || "Unnamed"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product?.brand || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {product?.category || "-"}
                  </td>

                  <td className="px-6 py-4">
                    ₹{Number(product?.price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">{totalStock}</td>

                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL (unchanged UI, safe state) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* FORM (unchanged, already safe) */}
            {/* Your existing form JSX remains same */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
