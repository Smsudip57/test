"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MyContext } from "@/context/context";
import {
    useOldEditServiceMutation,
    useOldGetServicesQuery,
} from "@/redux/api/serviceApi";
import { FieldInput } from "@/components/with-hook-form/FieldInput";
import { FieldSelector } from "@/components/with-hook-form/FieldSelector";
import { FileInput } from "@/components/with-hook-form/FileInput";
import {
    DEFAULT_SERVICE_FORM_VALUES,
    SERVICE_CATEGORIES,
    ServiceFormValues,
    ServiceItem,
} from "./types";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const schema = z.object({
    Title: z.string().min(1, "Title is required"),
    Name: z.string().min(1, "Name is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(slugRegex, "Slug must contain only lowercase letters, numbers and hyphens"),
    detail: z.string().min(1, "Detail is required"),
    moreDetail: z.string().min(1, "More detail is required"),
    category: z.string().min(1, "Category is required"),
    image: z.string().min(1, "Image is required"),
});

const toSlug = (value: string | null | undefined) =>
    (value ?? "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export default function EditService() {
    const { setShowConfirm, setConfirmFunction, customToast } =
        useContext(MyContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [autoSlug, setAutoSlug] = useState(false);
    const {
        data: services = [],
        isLoading: loadingList,
        error: servicesError,
        refetch,
    } = useOldGetServicesQuery();
    const [editService] = useOldEditServiceMutation();

    const methods = useForm<ServiceFormValues>({
        resolver: zodResolver(schema),
        defaultValues: DEFAULT_SERVICE_FORM_VALUES,
        mode: "onSubmit",
    });

    const { handleSubmit, reset, watch, setValue } = methods;
    const watchedTitle = watch("Title");

    useEffect(() => {
        if (!autoSlug) return;
        setValue("slug", toSlug(watchedTitle || ""), {
            shouldDirty: true,
            shouldValidate: true,
        });
    }, [autoSlug, watchedTitle, setValue]);

    useEffect(() => {
        if (servicesError) {
            customToast({
                success: false,
                message: "Failed to fetch services",
            });
        }
    }, [servicesError, customToast]);

    const filteredServices = useMemo(() => {
        if (!selectedCategory) return services;
        return services.filter((item) => item.category === selectedCategory);
    }, [services, selectedCategory]);

    const categoryOptions = useMemo(
        () => SERVICE_CATEGORIES.map((category) => ({ label: category, value: category })),
        []
    );

    const openEditor = (service: ServiceItem) => {
        setEditingId(service._id);
        setAutoSlug(false);
        reset({
            Title: service.Title,
            Name: service.Name,
            slug: service.slug,
            detail: service.deltail,
            moreDetail: service.moreDetail,
            category: service.category,
            image: service.image,
        });
    };

    const closeEditor = () => {
        setEditingId(null);
        setAutoSlug(false);
        reset(DEFAULT_SERVICE_FORM_VALUES);
    };

    const submitEdit = async (data: ServiceFormValues) => {
        if (!editingId) return;
        setIsSubmitting(true);
        try {
            const response = await editService({
                serviceId: editingId,
                Title: data.Title,
                Name: data.Name,
                slug: data.slug,
                deltail: data.detail,
                moreDetail: data.moreDetail,
                category: data.category,
                image: data.image,
            }).unwrap();

            customToast(response);
            await refetch();
            closeEditor();
        } catch (error: any) {
            customToast(
                error?.data || {
                    success: false,
                    message: "Failed to update service",
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = handleSubmit((data) => {
        setShowConfirm("Are you sure you want to update this service?");
        setConfirmFunction(() => () => submitEdit(data));
    });

    if (loadingList) {
        return <div className="w-full p-8 text-gray-700">Loading services...</div>;
    }

    return (
        <div className="w-full p-8 bg-[#f5f5f5] rounded-lg">
            {!editingId && (
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                        <h1 className="text-xl font-bold text-gray-800">Edit Service</h1>
                        <div className="w-64">
                            <label className="text-xs text-gray-500 font-medium">Filter by category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            >
                                <option value="">All categories</option>
                                {SERVICE_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredServices.length === 0 ? (
                        <p className="h-48 flex items-center justify-center text-gray-500">No services available.</p>
                    ) : (
                        <ul className="space-y-3">
                            {filteredServices.map((service) => (
                                <li key={service._id} className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.Title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : null}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-gray-900 truncate">{service.Title}</h2>
                                        <p className="text-sm text-gray-600 truncate">{service.Name}</p>
                                        <p className="text-sm text-gray-500 truncate">{service.slug}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEditor(service)}
                                        className="bg-[#446E6D] hover:opacity-90 text-white px-3 py-2 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {editingId && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <button
                        type="button"
                        onClick={closeEditor}
                        className="text-sm text-gray-500 mb-4 hover:text-gray-800"
                    >
                        Back
                    </button>

                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Update Service</h2>
                    <FormProvider {...methods}>
                        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <FileInput
                                    name="image"
                                    label="Service Image"
                                    placeholder="Upload service image"
                                    required
                                    accept="image/*"
                                    dimensions={{ width: 1920, height: 1080 }}
                                    tolerance={5}
                                />
                            </div>

                            <div className="space-y-4">
                                <FieldInput name="Title" label="Title" required />
                                <FieldInput name="Name" label="Name" required />

                                <div className="space-y-2">
                                    <FieldInput
                                        name="slug"
                                        label="Slug"
                                        required
                                        onChangeCapture={() => setAutoSlug(false)}
                                    />
                                    <label className="text-sm text-gray-600 inline-flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={autoSlug}
                                            onChange={() => setAutoSlug((prev) => !prev)}
                                        />
                                        Auto-generate slug from title
                                    </label>
                                </div>

                                <FieldInput name="detail" label="Detail" type="textarea" rows={5} required />
                                <FieldInput
                                    name="moreDetail"
                                    label="More Detail"
                                    type="textarea"
                                    rows={4}
                                    required
                                />
                                <FieldSelector
                                    name="category"
                                    label="Category"
                                    required
                                    options={categoryOptions}
                                    placeholder="Select category"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-[#446E6D] hover:opacity-90 text-white py-2.5 rounded-md disabled:opacity-60"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}
        </div>
    );
}
