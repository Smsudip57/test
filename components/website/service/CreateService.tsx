"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MyContext } from "@/context/context";
import { useOldCreateServiceMutation } from "@/redux/api/serviceApi";
import { FieldInput } from "@/components/with-hook-form/FieldInput";
import { FieldSelector } from "@/components/with-hook-form/FieldSelector";
import { FileInput } from "@/components/with-hook-form/FileInput";
import {
    DEFAULT_SERVICE_FORM_VALUES,
    SERVICE_CATEGORIES,
    ServiceFormValues,
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

export default function CreateService() {
    const { setShowConfirm, setConfirmFunction, customToast } =
        useContext(MyContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [createService] = useOldCreateServiceMutation();

    const methods = useForm<ServiceFormValues>({
        resolver: zodResolver(schema),
        defaultValues: DEFAULT_SERVICE_FORM_VALUES,
        mode: "onSubmit",
    });

    const { watch, setValue, handleSubmit, reset } = methods;
    const watchedTitle = watch("Title");

    useEffect(() => {
        if (!autoSlug) return;
        setValue("slug", toSlug(watchedTitle || ""), {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [autoSlug, watchedTitle, setValue]);

    const categoryOptions = useMemo(
        () => SERVICE_CATEGORIES.map((category) => ({ label: category, value: category })),
        []
    );

    const submitService = async (data: ServiceFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await createService({
                Title: data.Title,
                Name: data.Name,
                slug: data.slug,
                detail: data.detail,
                moreDetail: data.moreDetail,
                category: data.category,
                image: data.image,
            }).unwrap();

            customToast(response);
            reset(DEFAULT_SERVICE_FORM_VALUES);
            setAutoSlug(true);
        } catch (error: any) {
            customToast(
                error?.data || {
                    success: false,
                    message: "Failed to create service",
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = handleSubmit((data) => {
        setShowConfirm("Are you sure you want to create this service?");
        setConfirmFunction(() => () => submitService(data));
    });

    return (
        <div className="w-full p-8 bg-white rounded-lg shadow-sm text-gray-800">
            <h1 className="text-xl font-bold mb-6">Create Service</h1>

            <FormProvider {...methods}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
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
                        <FieldInput name="Title" label="Title" required placeholder="Enter service title" />
                        <FieldInput name="Name" label="Name" required placeholder="Enter service name" />

                        <div className="space-y-2">
                            <FieldInput
                                name="slug"
                                label="Slug"
                                required
                                placeholder="service-slug"
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

                        <FieldInput
                            name="detail"
                            label="Detail"
                            type="textarea"
                            rows={5}
                            required
                            placeholder="Short detail"
                        />
                        <FieldInput
                            name="moreDetail"
                            label="More Detail"
                            type="textarea"
                            rows={4}
                            required
                            placeholder="Detailed description"
                        />

                        <FieldSelector
                            name="category"
                            label="Category"
                            required
                            placeholder="Select category"
                            options={categoryOptions}
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#446E6D] hover:opacity-90 text-white py-2.5 rounded-md disabled:opacity-60"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Service"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
