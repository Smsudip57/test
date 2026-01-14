"use client";

import React, { useContext, useMemo, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MyContext } from "@/context/context";
import { ProductForm, ProductFormData } from "./ChildAndProductForm";
import {
  useOldCreateParentServiceMutation,
  useOldEditParentServiceMutation,
  useOldDeleteParentServiceMutation,
  useListParentServicesQuery,
} from "@/app/redux/api/parentServiceApi";
import {
  useOldGetServicesQuery
} from "@/app/redux/api/serviceApi";
import {
  useOldCreateChildServiceMutation,
  useOldEditChildServiceMutation,
  useOldDeleteChildServiceMutation,
  useListChildServicesQuery,
} from "@/app/redux/api/childServiceApi";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import Image from "next/image";
import ContainerWrapper from "@/components/shaerd/ContainerWrapper";
import FormTitle from "@/components/shaerd/FormTitle";

// Constants
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_URL_REGEX = /^(http|https):\/\/|^\/|^[^\/]/;
const EMPTY_SECTION = { title: "", image: "", points: [{ title: "", detail: "" }] };

// Zod Schemas
const pointSchema = z.object({
  title: z.string().min(1, "Point title is required"),
  detail: z.string().min(1, "Point detail is required"),
});

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  image: z.string().min(1, "Section image is required").refine(
    (val) => IMAGE_URL_REGEX.test(val),
    { message: "Section image must be a valid path or URL" }
  ),
  points: z.array(pointSchema).min(1, "At least one point is required in a section"),
});

const productSchema = z.object({
  Title: z.string().min(1, "Title is required"),
  detail: z.string().min(1, "Detail is required"),
  slug: z.string().min(1, "Slug is required").regex(SLUG_REGEX, "Invalid slug format"),
  moreDetail: z.string().min(1, "Detail is required"),
  image: z.string().min(1, "Image is required"),
  category: z.string().min(1, "Category is required"),
  itemsTag: z.string().optional(),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

const DEFAULT_FORM_VALUES: ProductFormData = {
  Title: "",
  detail: "",
  moreDetail: "",
  slug: "",
  category: "",
  image: "",
  sections: [EMPTY_SECTION],
};

// Utility functions
const generateSlug = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

interface ModuleConfig {
  isChild: boolean;
  label: string;
  createMutation: any;
  editMutation: any;
  deleteMutation: any;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  data: any[];
  isLoading: boolean;
}

interface PathInfo {
  moduleType: string;
  mode: "create" | "edit" | "delete";
}

export default function ProductManager() {
  const pathname: any = usePathname();
  const { setShowConfirm, setConfirmFunction, customToast } = useContext(MyContext);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);

  // Extract path info
  const { moduleType, mode } = useMemo<PathInfo>(() => {
    const segments = pathname.split("/").filter(Boolean);
    return {
      moduleType: segments[segments.length - 2] || "product",
      mode: segments[segments.length - 1] as "create" | "edit" | "delete",
    };
  }, [pathname]);

  const isChildModule = moduleType !== "child-service";

  // API Hooks
  const [createProduct] = useOldCreateParentServiceMutation();
  const [editProduct] = useOldEditParentServiceMutation();
  const [deleteProduct] = useOldDeleteParentServiceMutation();
  const { data: servicesData, isLoading: servicesLoading } = useOldGetServicesQuery({});
  const { data: productsData, isLoading: productsLoading } = useListParentServicesQuery({});

  const [createChildService] = useOldCreateChildServiceMutation();
  const [editChildService] = useOldEditChildServiceMutation();
  const [deleteChildService] = useOldDeleteChildServiceMutation();
  const { data: childServicesData, isLoading: childServicesLoading } = useListChildServicesQuery({});

  // Module configuration
  const moduleConfig = useMemo<ModuleConfig>(() => {
    if (isChildModule) {
      return {
        isChild: false,
        label: "Product",
        createMutation: createChildService,
        editMutation: editChildService,
        deleteMutation: deleteChildService,
        isCreating: false, // Would need proper state management
        isEditing: false,
        isDeleting: false,
        data: childServicesData || [],
        isLoading: childServicesLoading,
      };
    }
    return {
      isChild: true,
      label: "Child Service",
      createMutation: createProduct,
      editMutation: editProduct,
      deleteMutation: deleteProduct,
      isCreating: false,
      isEditing: false,
      isDeleting: false,
      data: productsData || [],
      isLoading: productsLoading,
    };
  }, [isChildModule, createChildService, editChildService, deleteChildService, childServicesData, childServicesLoading, createProduct, editProduct, deleteProduct, productsData, productsLoading]);

  // Form setup
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: selectedProduct || DEFAULT_FORM_VALUES,
  });

  const { handleSubmit, watch, setValue, reset } = methods;

  // Reset form when selectedProduct changes (for edit mode)
  useEffect(() => {
    if (selectedProduct) {
      // Reset form with proper data structure
      const formData = {
        ...selectedProduct,
        // Ensure image fields are strings (not null/undefined)
        image: selectedProduct.image || "",
        sections: selectedProduct.sections?.map(section => ({
          ...section,
          image: section.image || "",
          points: section.points || []
        })) || [EMPTY_SECTION]
      };
      reset(formData);
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [selectedProduct, reset]);

  // Auto-generate slug
  useEffect(() => {
    const subscription = watch((data) => {
      if (data.Title) {
        const newSlug = generateSlug(data.Title);
        // Only update slug if it's different from current value to prevent infinite loop
        if (data.slug !== newSlug) {
          setValue("slug", newSlug);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Category options
  const categoryOptions = useMemo(() => {
    const data = isChildModule ? productsData : servicesData?.services;
    return (Array.isArray(data) ? data : []).map((item: any) => ({
      label: item.Title,
      value: item._id,
    }));
  }, [isChildModule, productsData, servicesData]);

  const categoryLoading = isChildModule ? productsLoading : servicesLoading;

  // Handlers
  const handleSubmitWrapper = useCallback(async (data: ProductFormData, action: "create" | "edit" | "delete", itemId?: string) => {
    const executeAction = async () => {
      try {
        if (action === "create") {
          await moduleConfig.createMutation(data).unwrap();
          customToast({ success: true, message: `${moduleConfig.label} created successfully!` });
          reset(DEFAULT_FORM_VALUES);
        } else if (action === "edit" && selectedProduct) {
          const payload = isChildModule
            ? { childId: selectedProduct._id, ...data }
            : { productId: selectedProduct._id, ...data };
          await moduleConfig.editMutation(payload).unwrap();
          customToast({ success: true, message: `${moduleConfig.label} updated successfully!` });
          setSelectedProduct(null);
          reset();
        } else if (action === "delete" && itemId) {
          const payload = isChildModule ? { childId: itemId } : { productId: itemId };
          await moduleConfig.deleteMutation(payload).unwrap();
          customToast({ success: true, message: `${moduleConfig.label} deleted successfully!` });
        }
      } catch (error: any) {
        customToast({
          success: false,
          message: error?.data?.message || `Failed to ${action} ${moduleConfig.label.toLowerCase()}`,
        });
      }
    };

    setShowConfirm(`Are you sure you want to ${action} this ${moduleConfig.label}?`);
    setConfirmFunction(() => executeAction);
  }, [moduleConfig, isChildModule, selectedProduct, reset, setShowConfirm, setConfirmFunction, customToast]);

  // Render components
  const renderProductCard = (product: any) => (
    <div key={product._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.Title}
            width={240}
            height={160}
            className="object-cover rounded-lg w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="px-4 flex flex-col flex-grow">
        <div className="font-bold text-lg text-gray-800 truncate mb-1">{product.Title}</div>
        <div className="text-sm text-gray-500 truncate mb-2">{product.slug}</div>
        <div className="text-sm text-gray-700 mb-4 line-clamp-2">{product.detail}</div>
        <div className="mt-auto flex justify-end gap-2 mb-4">
          {mode === "edit" && (
            <button
              type="button"
              className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow"
              onClick={() => setSelectedProduct(product)}
              title="Edit"
            >
              <Pencil size={20} />
            </button>
          )}
          {mode === "delete" && (
            <button
              type="button"
              className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow"
              onClick={() => handleSubmitWrapper(product, "delete", product._id)}
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 lg:px-16">
        <div className="max-w-8xl mx-auto">
          <FormTitle
            title={`${mode === "edit" ? "Edit" : mode === "delete" ? "Delete" : "Create New"} ${moduleConfig.label}`}
            details={
              mode === "create"
                ? `Add a new ${moduleConfig.label.toLowerCase()} to your catalog.`
                : mode === "edit"
                  ? `Update ${moduleConfig.label.toLowerCase()} information, images, and details.`
                  : `Select and remove a ${moduleConfig.label.toLowerCase()} from your catalog.`
            }
            className="text-primary"
          />
          <ContainerWrapper>
            {mode === "create" && (
              <form onSubmit={handleSubmit((data) => handleSubmitWrapper(data, "create"))} className="space-y-10">
                <ProductForm
                  serviceOptions={categoryOptions}
                  servicesLoading={categoryLoading}
                  isChildModule={isChildModule}
                  moduleLabel={moduleConfig.label}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="default" size="default" className="flex items-center px-6 py-3">
                    <CheckCircle className="mr-2" size={20} />
                    Create {moduleConfig.label}
                  </Button>
                </div>
              </form>
            )}

            {(mode === "edit" || mode === "delete") && !selectedProduct && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {mode === "edit" ? "Select a" : "Select a"} {moduleConfig.label.toLowerCase()} to {mode}:
                </h2>
                {moduleConfig.isLoading ? (
                  <p>Loading items...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {moduleConfig.data.map(renderProductCard)}
                  </div>
                )}
              </div>
            )}

            {mode === "edit" && selectedProduct && (
              <>
                <div className="flex justify-start mb-6">
                  <Button
                    type="button"
                    variant="normal"
                    size="sm"
                    onClick={() => { setSelectedProduct(null); reset(); }}
                  >
                    ← Back to list
                  </Button>
                </div>
                <form onSubmit={handleSubmit((data) => handleSubmitWrapper(data, "edit"))} className="space-y-10">
                  <ProductForm
                    serviceOptions={categoryOptions}
                    servicesLoading={categoryLoading}
                    isChildModule={isChildModule}
                    moduleLabel={moduleConfig.label}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="default" size="default" className="flex items-center px-6 py-3">
                      <CheckCircle className="mr-2" size={20} />
                      Update {moduleConfig.label}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </ContainerWrapper>
        </div>
      </div>
    </FormProvider>
  );
}
