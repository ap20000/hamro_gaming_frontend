"use client";

import { useState, useEffect } from "react";
import { Game } from "@/type/game";
import { X, Image as ImageIcon } from "lucide-react";

import Button from "../button";
import ErrorMessage from "../error_message";
import SuccessMessage from "../success_message";
import { API_BASE_URL } from "@/config/config";
import DefaultImg from "../../../../public/images/authBg.jpg";
      
interface GameFormProps {
  game?: Game;
  onSubmit: (gameData: FormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export interface Account {
  _id?: string;
  email: string;
  password: string;
  code?: string | null;
  label: string;
  price: string;
  used: boolean;
}

interface SharedAccount {
  email?: string;
  password?: string;
  code?: string | null;
  quantity?: number;
  label?: string;
  price?: string;
}

interface GameFormData {
  name: string;
  description: string;
  image: string;
  deliveryTime: string;
  platform: string;
  region: string;
  gameType: string;
  status: string;
  productType: "topup" | "giftcard" | "cdkey" | "account";
  itemType?: string;
  topupOptions?: Array<{
    label: string;
    amount: string;
    price: string;
  }>;
  giftcardAmountOptions?: Array<{
    label: string;
    amount: string;
    price: string;
  }>;
  accounts?: Account[];
  keys?: string[];
  expirationDate?: string;
  accountType?: "private" | "shared";
  sharedAccount?: SharedAccount;
}

export default function GameForm({
  game,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}: GameFormProps) {
  const [activeTab, setActiveTab] = useState<"topup" | "giftcard" | "account">(
    "topup"
  );
  const [accountInput, setAccountInput] = useState({
    label: "",
    email: "",
    password: "",
    code: "",
    price: "",
  });

  const [formData, setFormData] = useState<GameFormData>({
  name: "",
  description: "",
  image: "",
  deliveryTime: "",
  platform: "",
  region: "",
  gameType: "",
  status: "active",
  productType: "topup",
  itemType: "",
  topupOptions: [],
  giftcardAmountOptions: [],
  keys: [],
  accounts: [],
  sharedAccount: undefined
});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [topupOptionInput, setTopupOptionInput] = useState({
    label: "",
    amount: "",
    price: "",
  });
  const [giftcardOptionInput, setGiftcardOptionInput] = useState({
    label: "",
    amount: "",
    price: "",
  });

  useEffect(() => {
  if (game && isEditing) {
    const initialData: GameFormData = {
      name: game.name,
      description: game.description,
      image: game.image,
      deliveryTime: game.deliveryTime,
      platform: game.platform,
      region: game.region,
      gameType: game.gameType,
      status: game.status,
      productType: game.productType || "topup",
      itemType: game.itemType || "",
      topupOptions: game.topupOptions || [],
      giftcardAmountOptions: game.giftcardAmountOptions || [],
      keys: game.keys || [],
      accounts:
        game.accounts?.map((acc) => ({
          ...acc,
          used: acc.used || false,
          password: acc.password || "",
          email: acc.email || "",
          label: acc.label || "",
          code: acc.code || null,
          price: acc.price || "",
        })) || [],
      expirationDate: game.expirationDate || "",
      sharedAccount: undefined,
    };

    if (game.productType === "account") {
      initialData.accountType = game.accountType || "private";
      if (game.accountType === "shared" && game.sharedAccount) {
        initialData.sharedAccount = {
          label: game.sharedAccount.label || "",
          email: game.sharedAccount.email,
          password: game.sharedAccount.password,
          code: game.sharedAccount.code || "",
          price: game.sharedAccount.price,
          quantity: game.sharedAccount.quantity || 0,
        };
      }
    }

    setFormData(initialData);

    if (game.image) {
      let fullImageUrl = game.image;
      if (!game.image.startsWith("http")) {
        const baseUrl = API_BASE_URL.replace("/api", "");
        fullImageUrl = `${baseUrl}${game.image}`;
      }
      if (fullImageUrl) {
        fullImageUrl = fullImageUrl.replace(/\\/g, "/");
      }
      setImagePreview(fullImageUrl);
    }
  }
}, [game, isEditing]);


  const handleSharedAccountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      sharedAccount: {
        ...(prev.sharedAccount || {
          label: "",
          email: "",
          password: "",
          code: "",
          price: "",
          quantity: 0,
        }),
        [name.replace("sharedAccount", "").replace(/[\[\]]/g, "")]:
          name.includes("quantity") ? parseInt(value) || 0 : value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.platform.trim()) newErrors.platform = "Platform is required";
    if (!formData.region.trim()) newErrors.region = "Region is required";
    if (!formData.gameType.trim()) newErrors.gameType = "Game type is required";
    if (!formData.deliveryTime.trim())
      newErrors.deliveryTime = "Delivery time is required";
    if (!formData.productType)
      newErrors.productType = "Product type is required";

    if (formData.productType === "topup" && !formData.itemType) {
      newErrors.itemType = "Item type is required for top-up";
    }

    if (
      formData.productType === "giftcard" &&
      (!formData.keys || formData.keys.length === 0)
    ) {
      newErrors.keys = "At least one key is required for gift cards";
    }

    if (formData.accountType === "private") {
      if (!formData.accounts || formData.accounts.length === 0) {
        newErrors.accounts = "At least one account is required";
      } else if (formData.accounts.some((acc) => !acc.price)) {
        newErrors.accounts = "All accounts must have a price";
      }
    } else if (formData.accountType === "shared") {
      if (
        !formData.sharedAccount ||
        !formData.sharedAccount.email ||
        !formData.sharedAccount.label ||
        !formData.sharedAccount.password ||
        !formData.sharedAccount.price ||
(formData.sharedAccount.quantity ?? 0) <= 0      ) {
        newErrors.sharedAccount =
          "Shared account details are required and quantity must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 10MB",
        }));
        return;
      }
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a valid image file",
      }));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const addAccount = () => {
    if (accountInput.email && accountInput.password) {
      setFormData((prev) => ({
        ...prev,
        accounts: [
          ...(prev.accounts || []),
          {
            label: accountInput.label,
            email: accountInput.email,
            password: accountInput.password,
            code: accountInput.code || null,
            price: accountInput.price,
            used: false,
          },
        ],
      }));
      setAccountInput({
        email: "",
        password: "",
        code: "",
        price: "",
        label: "",
      });
    }
  };

  const removeAccount = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      accounts: (prev.accounts || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!imageFile && !isEditing && !formData.image) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("deliveryTime", formData.deliveryTime);
      data.append("platform", formData.platform);
      data.append("region", formData.region);
      data.append("gameType", formData.gameType);
      data.append("status", formData.status);
      data.append("productType", formData.productType);

      if (formData.productType === "topup") {
        data.append("itemType", formData.itemType || "");
        if (formData.topupOptions && formData.topupOptions.length > 0) {
          data.append("topupOptions", JSON.stringify(formData.topupOptions));
        }
      }

      if (formData.productType === "account") {
        data.append("accountType", formData.accountType || "");

        if (formData.accountType === "private") {
          if (formData.accounts && formData.accounts.length > 0) {
            formData.accounts.forEach((account, index) => {
              data.append(`accounts[${index}][label]`, account.label);
              data.append(`accounts[${index}][email]`, account.email);
              data.append(`accounts[${index}][password]`, account.password);
              data.append(`accounts[${index}][code]`, account.code || "");
              data.append(`accounts[${index}][price]`, account.price);
              data.append(`accounts[${index}][used]`, "false");
            });
          }
        } else if (
          formData.accountType === "shared" &&
          formData.sharedAccount
        ) {
          data.append("sharedAccount[label]", formData.sharedAccount.label);

          data.append("sharedAccount[email]", formData.sharedAccount.email);
          data.append(
            "sharedAccount[password]",
            formData.sharedAccount.password
          );
          if (formData.sharedAccount.code) {
            data.append("sharedAccount[code]", formData.sharedAccount.code);
          }
          data.append(
            "sharedAccount[quantity]",
            formData.sharedAccount.quantity.toString()
          );
          data.append("sharedAccount[price]", formData.sharedAccount.price);
        }
      }

      if (
        formData.productType === "giftcard" ||
        formData.productType === "cdkey"
      ) {
        if (
          formData.giftcardAmountOptions &&
          formData.giftcardAmountOptions.length > 0
        ) {
          data.append(
            "giftcardAmountOptions",
            JSON.stringify(formData.giftcardAmountOptions)
          );
        }
        if (formData.keys && formData.keys.length > 0) {
          data.append("keys", formData.keys.join(","));
        }
        if (formData.expirationDate) {
          data.append("expirationDate", formData.expirationDate);
        }
      }

      if (imageFile) {
        data.append("image", imageFile);
      } else if (isEditing && formData.image) {
        data.append("existingImage", formData.image);
      }
      console.log("Form Data Contents:");
      data.forEach((value, key) => {
        console.log(key, value);
      });
      await onSubmit(data);

      setSubmitSuccess(
        isEditing ? "Game updated successfully!" : "Game added successfully!"
      );
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addTopupOption = () => {
    if (
      topupOptionInput.label &&
      topupOptionInput.amount &&
      topupOptionInput.price
    ) {
      setFormData((prev) => ({
        ...prev,
        topupOptions: [
          ...(prev.topupOptions || []),
          {
            label: topupOptionInput.label,
            amount: topupOptionInput.amount,
            price: topupOptionInput.price,
          },
        ],
      }));
      setTopupOptionInput({ label: "", amount: "", price: "" });
    }
  };

  const removeTopupOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topupOptions: (prev.topupOptions || []).filter((_, i) => i !== index),
    }));
  };

  const addGiftcardOption = () => {
    if (
      giftcardOptionInput.label &&
      giftcardOptionInput.amount &&
      giftcardOptionInput.price
    ) {
      setFormData((prev) => ({
        ...prev,
        giftcardAmountOptions: [
          ...(prev.giftcardAmountOptions || []),
          {
            label: giftcardOptionInput.label,
            amount: giftcardOptionInput.amount,
            price: giftcardOptionInput.price,
          },
        ],
      }));
      setGiftcardOptionInput({ label: "", amount: "", price: "" });
    }
  };

  const removeGiftcardOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      giftcardAmountOptions: (prev.giftcardAmountOptions || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addKey = (key: string) => {
    if (key.trim()) {
      setFormData((prev) => ({
        ...prev,
        keys: [...(prev.keys || []), key.trim()],
      }));
    }
  };

  const removeKey = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keys: (prev.keys || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-gaming-black flex items-center justify-center p-4 z-50">
      <div className="bg-gaming-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gaming-gray/20">
          <h2 className="text-2xl font-sans font-bold text-gaming-black">
            {isEditing ? "Edit Game" : "Add New Game"}
          </h2>
        </div>

        <div className="flex border-b border-gaming-gray/20">
          <button
            type="button"
            className={`px-4 py-2 font-medium ${
              activeTab === "topup"
                ? "text-gaming-electric-blue border-b-2 border-gaming-electric-blue"
                : "text-gaming-gray/40"
            }`}
            onClick={() => {
              setActiveTab("topup");
              setFormData((prev) => ({ ...prev, productType: "topup" }));
            }}
          >
            Top-Up
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium ${
              activeTab === "giftcard"
                ? "text-gaming-electric-blue border-b-2 border-gaming-electric-blue"
                : "text-gaming-gray/40"
            }`}
            onClick={() => {
              setActiveTab("giftcard");
              setFormData((prev) => ({ ...prev, productType: "giftcard" }));
            }}
          >
            Gift Card/CD Key
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium ${
              activeTab === "account"
                ? "text-gaming-electric-blue border-b-2 border-gaming-electric-blue"
                : "text-gaming-gray/40"
            }`}
            onClick={() => {
              setActiveTab("account");
              setFormData((prev) => ({ ...prev, productType: "account" }));
            }}
          >
            Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitSuccess && <SuccessMessage message={submitSuccess} />}
          {submitError && <ErrorMessage message={submitError} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg font-sans ${
                  errors.name ? "border-red-500" : "border-gaming-gray/20"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Platform *
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg font-sans ${
                  errors.platform ? "border-red-500" : "border-gaming-gray/20"
                }`}
              >
                <option value="">Select Platform</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
              </select>
              {errors.platform && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.platform}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg font-sans ${
                  errors.region ? "border-red-500" : "border-gaming-gray/20"
                }`}
              >
                <option value="">Select Region</option>
                <option value="Global">Global</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Other">Other</option>
              </select>
              {errors.region && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.region}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Game Type *
              </label>
              <select
                name="gameType"
                value={formData.gameType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg font-sans ${
                  errors.gameType ? "border-red-500" : "border-gaming-gray/20"
                }`}
              >
                <option value="">Select Type</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="RPG">RPG</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="Racing">Racing</option>
                <option value="Simulation">Simulation</option>
                <option value="Other">Other</option>
              </select>
              {errors.gameType && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.gameType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Delivery Time *
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg font-sans ${
                  errors.deliveryTime
                    ? "border-red-500"
                    : "border-gaming-gray/20"
                }`}
                placeholder="e.g., 2 days or 5 hours"
              />
              {errors.deliveryTime && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.deliveryTime}
                </p>
              )}
            </div>
          </div>

          {activeTab === "topup" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                  Item Type *
                </label>
                <input
                  type="text"
                  name="itemType"
                  value={formData.itemType || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg font-sans ${
                    errors.itemType ? "border-red-500" : "border-gaming-gray/20"
                  }`}
                  placeholder="e.g., PUBG UC, Free Fire Diamonds"
                />
                {errors.itemType && (
                  <p className="text-red-600 font-sans text-sm mt-1">
                    {errors.itemType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                  Top-Up Options
                </label>
                <div className="space-y-4">
                  {formData.topupOptions?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {option.label}
                        </div>
                        <div className="text-sm text-gaming-gray/40">
                          {option.amount} for Rs.{option.price}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopupOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={topupOptionInput.label}
                      onChange={(e) =>
                        setTopupOptionInput((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      placeholder="Label (e.g., 100 UC)"
                      className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={topupOptionInput.amount}
                      onChange={(e) =>
                        setTopupOptionInput((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="Amount"
                      className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                    />
                    <input
                      type="text"
                      value={topupOptionInput.price}
                      onChange={(e) =>
                        setTopupOptionInput((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="Price"
                      className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTopupOption}
                    className="px-4 py-2 bg-gaming-gray/10 text-gaming-electric-blue rounded-lg hover:bg-gaming-gray/20"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "giftcard" && (
            <div className="space-y-6">
              <div>
                <div>
                  <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                    Gift Card Amount Options
                  </label>
                  <div className="space-y-4">
                    {formData.giftcardAmountOptions?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {option.label}
                          </div>
                          <div className="text-sm text-gaming-gray/40">
                            {option.amount} for Rs.{option.price}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGiftcardOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={giftcardOptionInput.label}
                        onChange={(e) =>
                          setGiftcardOptionInput((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Label (e.g., Apple Gift Card)"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="text"
                        value={giftcardOptionInput.amount}
                        onChange={(e) =>
                          setGiftcardOptionInput((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        placeholder="Amount"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="text"
                        value={giftcardOptionInput.price}
                        onChange={(e) =>
                          setGiftcardOptionInput((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="Price"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addGiftcardOption}
                      className="px-4 py-2 bg-gaming-gray/10 text-gaming-electric-blue rounded-lg hover:bg-gaming-gray/20"
                    >
                      Add Option
                    </button>
                  </div>
                </div>

                <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                  Keys *
                </label>
                <div className="space-y-2">
                  {formData.keys?.map((key, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gaming-gray/20 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeKey(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter key"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKey(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gaming-gray/20 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        if (input) {
                          addKey(input.value);
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-gaming-gray/10 text-gaming-electric-blue rounded-lg hover:bg-gaming-gray/20"
                    >
                      Add Key
                    </button>
                  </div>
                  {errors.keys && (
                    <p className="text-red-600 font-sans text-sm mt-1">
                      {errors.keys}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gaming-gray/20 rounded-lg font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                  Account Type *
                </label>
                <select
                  name="accountType"
                  value={formData.accountType || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      accountType: e.target.value as "private" | "shared",
                    }));
                    setErrors((prev) => ({ ...prev, accountType: "" }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg font-sans ${
                    errors.accountType
                      ? "border-red-500"
                      : "border-gaming-gray/20"
                  }`}
                >
                  <option value="">Select Account Type</option>
                  <option value="private">Private Account</option>
                  <option value="shared">Shared Account</option>
                </select>
                {errors.accountType && (
                  <p className="text-red-600 font-sans text-sm mt-1">
                    {errors.accountType}
                  </p>
                )}
              </div>

              {formData.accountType === "private" && (
                <div>
                  <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                    Accounts *
                  </label>
                  <div className="space-y-4">
                    {formData.accounts?.map((account, index) => (
                      <div
                        key={index}
                        className="border border-gaming-gray/20 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">{account.label}</span>
                            <span className="ml-2 text-sm text-gaming-gray/40">
                              ({account.email})
                            </span>
                            {account.code && (
                              <span className="ml-2 text-sm text-gaming-gray/40">
                                (Code: {account.code})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">
                              Rs.{account.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAccount(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                       <div className="text-sm text-gaming-gray/40">
  Password: {account.password ? account.password : "Not set"}
</div>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <input
                        type="text"
                        value={accountInput.label}
                        onChange={(e) =>
                          setAccountInput((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Label (e.g., Premium Account)"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="email"
                        value={accountInput.email}
                        onChange={(e) =>
                          setAccountInput((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Email"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="password"
                        value={accountInput.password}
                        onChange={(e) =>
                          setAccountInput((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Password"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="text"
                        value={accountInput.code}
                        onChange={(e) =>
                          setAccountInput((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        placeholder="Code (optional)"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                      <input
                        type="text"
                        value={accountInput.price}
                        onChange={(e) =>
                          setAccountInput((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="Price"
                        className="px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addAccount}
                      className="px-4 py-2 bg-gaming-gray/10 text-gaming-electric-blue rounded-lg hover:bg-gaming-gray/20"
                    >
                      Add Account
                    </button>
                    {errors.accounts && (
                      <p className="text-red-600 font-sans text-sm mt-1">
                        {errors.accounts}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {formData.accountType === "shared" && (
                <div>
                  <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                    Shared Account Details *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="sharedAccount[label]"
                        value={formData.sharedAccount?.label || ""}
                        onChange={handleSharedAccountChange}
                        placeholder="Label (e.g., Premium Shared)"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="sharedAccount[email]"
                        value={formData.sharedAccount?.email || ""}
                        onChange={handleSharedAccountChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="sharedAccount[password]"
                        value={formData.sharedAccount?.password || ""}
                        onChange={handleSharedAccountChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="sharedAccount[code]"
                        value={formData.sharedAccount?.code || ""}
                        onChange={handleSharedAccountChange}
                        placeholder="Code (optional)"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="sharedAccount[quantity]"
                        value={formData.sharedAccount?.quantity || 0}
                        onChange={handleSharedAccountChange}
                        placeholder="Quantity"
                        min="0"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="sharedAccount[price]"
                        value={formData.sharedAccount?.price || ""}
                        onChange={handleSharedAccountChange}
                        placeholder="Price"
                        className="w-full px-4 py-2 border border-gaming-gray/20 rounded-lg"
                      />
                    </div>
                  </div>
                  {errors.sharedAccount && (
                    <p className="text-red-600 font-sans text-sm mt-1">
                      {errors.sharedAccount}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg resize-none font-sans ${
                errors.description ? "border-red-500" : "border-gaming-gray/20"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-600 font-sans text-sm mt-1">
                {errors.description}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Product Image {!isEditing && "*"}
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg border border-gaming-gray/20"
                    // onError={(e) => {
                    //   console.error("Failed to load image at:", imagePreview);
                    //   if (imagePreview?.includes("/uploads/")) {
                    //     const directPath = imagePreview.replace(
                    //       /^.*\/uploads/,
                    //       "/uploads"
                    //     );
                    //     e.currentTarget.src = directPath;
                    //   }
                    // }}
                    onError={(e) => {
                      console.error("Failed to load image at:", imagePreview);
                      // Set a fallback image or empty state
                      e.currentTarget.src = DefaultImg.src;
                      e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-gaming-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gaming-gray/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gaming-gray/10 rounded-full flex items-center justify-center mb-3">
                        <ImageIcon className="w-7 h-7 text-gaming-gray/50" />
                      </div>
                      <p className="text-sm mb-1 font-sans">
                        <span className="font-medium text-gaming-electric-blue">
                          Click to upload
                        </span>
                      </p>
                    </div>
                  </label>
                </div>
              )}
              {errors.image && (
                <p className="text-red-600 font-sans text-sm mt-1">
                  {errors.image}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-sans text-gaming-gray/40 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gaming-gray/20 rounded-lg font-sans"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gaming-gray/40">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gaming-gray/20 rounded-lg font-sans text-gaming-gray/40 hover:bg-gaming-gray/20 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>

              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                className="px-8 py-3"
              >
                <span>
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Product"
                    : "Add Product"}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
