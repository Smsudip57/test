"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// Custom components
import { FieldInput } from "../../with-hook-form/FieldInput";
import { FieldSelector } from "../../with-hook-form/FieldSelector";
import { FileInput } from "../../with-hook-form/FileInput";
import { Button } from "../../ui/button";

// Icons
import {
    Plus,
    Trash2,
    Info,
    X,
} from "lucide-react";

// Types
export interface ProductFormData {
    _id?: string;
    Title: string;
    detail: string;
    moreDetail: string;
    slug: string;
    category: string;
    image: string;
    itemsTag?: string; // For child services only
    sections: {
        title: string;
        image: string;
        points: {
            title: string;
            detail: string;
        }[];
    }[];
}

interface ProductFormProps {
    serviceOptions: { label: string; value: string }[];
    servicesLoading?: boolean;
    onAddSection?: () => void;
    onRemoveSection?: (index: number) => void;
    slugPreview?: string;
    isChildModule?: boolean;
    moduleLabel?: string; // New prop for dynamic label
}

export function ProductForm({
    serviceOptions,
    servicesLoading = false,
    onAddSection,
    onRemoveSection,
    slugPreview = "example-slug",
    isChildModule = false,
    moduleLabel = "Product" // Default value
}: ProductFormProps) {
    const { control, watch } = useFormContext<ProductFormData>();

    // Field Arrays
    const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
        control,
        name: "sections",
    });

    // Internal section management
    const addSection = () => {
        appendSection({ title: "", image: "", points: [{ title: "", detail: "" }] });
        onAddSection?.(); // Call the parent callback for any additional logic
    };

    const removeSectionAt = (index: number) => {
        if (sectionFields.length <= 1) {
            // Can't remove the last section - need at least one
            return;
        }
        removeSection(index);
        onRemoveSection?.(index); // Call the parent callback for any additional logic
    };

    return (
        <div className="space-y-12">
            {/* Product Main Information */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Left Column - Image & Category */}
                <div className="md:col-span-5 space-y-8">
                    <h2 className="text-lg font-bold text-primary mb-4">{moduleLabel} Image & Category</h2>
                    <FileInput
                        name="image"
                        label={`Main ${moduleLabel} Image`}
                        placeholder={`Upload ${moduleLabel.toLowerCase()} image with 16:9 aspect ratio`}
                        required
                        accept="image/*"
                        dimensions={{ width: 1920, height: 1080 }}
                        tolerance={5}
                    />
                    <FieldSelector
                        name="category"
                        label="Service"
                        options={serviceOptions}
                        placeholder="Select a service"
                        required
                        disabled={servicesLoading}
                    />
                </div>

                {/* Right Column - Product Details */}
                <div className="md:col-span-7 space-y-8">
                    <h2 className="text-lg font-bold text-primary mb-4">{moduleLabel} Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FieldInput
                            name="Title"
                            label={`${moduleLabel} Title`}
                            placeholder={`Enter ${moduleLabel.toLowerCase()} title`}
                            required
                        />
                        <div>
                            <FieldInput
                                name="slug"
                                label="Slug"
                                placeholder="product-name-example"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Only lowercase letters, numbers, and hyphens. Used in URLs: /{moduleLabel.toLowerCase()}/{slugPreview}
                            </p>
                        </div>
                    </div>
                    {isChildModule && (
                        <FieldInput
                            name="itemsTag"
                            label="Items Tag"
                            placeholder="Enter items tag (e.g., 'feature, benefit, capability')"
                            required
                        />
                    )}
                    <FieldInput
                        name="detail"
                        type="textarea"
                        label="Short Description"
                        placeholder="Brief description of the product"
                        rows={3}
                        required
                    />
                    <FieldInput
                        name="moreDetail"
                        type="textarea"
                        label="Full Description"
                        placeholder="Detailed description of the product"
                        rows={5}
                        required
                    />
                </div>
            </div>

            {/* Product Sections */}
            <div className="pt-10 border-t border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-lg font-bold text-gray-700">
                        {moduleLabel} Sections ({sectionFields.length})
                    </h2>
                    <Button
                        type="button"
                        variant="default"
                        size="default"
                        onClick={addSection}
                        className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold shadow"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Section
                    </Button>
                </div>

                <div className="space-y-8">
                    <AnimatePresence>
                        {sectionFields.map((field, sectionIndex) => (
                            <SectionItem
                                key={field.id}
                                sectionIndex={sectionIndex}
                                onRemoveSection={removeSectionAt}
                                totalSections={sectionFields.length}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// SectionItem component with React Hook Form integration
const SectionItem = React.memo(
    ({
        sectionIndex,
        onRemoveSection,
        totalSections,
    }: {
        sectionIndex: number;
        onRemoveSection: (index: number) => void;
        totalSections: number;
    }) => {
        const { control, watch } = useFormContext<ProductFormData>();

        // Points field array for this section
        const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
            control,
            name: `sections.${sectionIndex}.points`,
        });

        const sectionTitle = watch(`sections.${sectionIndex}.title`);

        const addPoint = () => {
            appendPoint({ title: "", detail: "" });
        };

        const removePointAt = (pointIndex: number) => {
            if (pointFields.length <= 1) {
                // Can't remove the last point
                return;
            }
            removePoint(pointIndex);
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative rounded-2xl border border-primary/20 bg-white shadow-lg overflow-hidden mb-8"
            >
                {/* Section Header */}
                <div className="flex items-center justify-between bg-primary/5 px-8 py-5 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-primary_dark">
                            Section {sectionIndex + 1}
                        </h3>
                        {sectionTitle && (
                            <span className="text-xs text-primary">
                                ({sectionTitle})
                            </span>
                        )}
                    </div>
                    {totalSections > 1 && (
                        <Button
                            type="button"
                            variant="danger"
                            size="icon"
                            onClick={() => onRemoveSection(sectionIndex)}
                            className="p-2"
                        >
                            <Trash2 size={18} />
                        </Button>
                    )}
                </div>

                {/* Section Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6"><div className="flex flex-col gap-2">
                        <FileInput
                            name={`sections.${sectionIndex}.image`}
                            label="Section Image"
                            placeholder="Upload section image with 16:9 aspect ratio"
                            required
                            accept="image/*"
                            dimensions={{ width: 1920, height: 1080 }}
                            tolerance={3}
                        />
                    </div>
                        <div className="flex flex-col gap-2">
                            <FieldInput
                                name={`sections.${sectionIndex}.title`}
                                label="Section Title"
                                placeholder="Enter section title"
                                required
                            />
                        </div>

                    </div>

                    {/* Points Section */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-bold text-primary_dark">Key Points</h4>
                            <Button
                                type="button"
                                variant="normal"
                                size="default"
                                onClick={addPoint}
                                className="inline-flex items-center px-4 py-2 rounded-xl font-semibold"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Point
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {pointFields.map((field, pointIndex) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="rounded-xl bg-gray-50 border border-primary/10 p-6 flex flex-col gap-4 relative"
                                    >
                                        <div className="grid">{pointFields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="icon"
                                                onClick={() => removePointAt(pointIndex)}
                                                className="w-8 h-8 absolute top-4 right-4"
                                            >
                                                <X size={14} />
                                            </Button>
                                        )}
                                            <div className="flex flex-col gap-2">
                                                <FieldInput
                                                    name={`sections.${sectionIndex}.points.${pointIndex}.title`}
                                                    label="Point Title"
                                                    placeholder="Enter point title"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 relative">
                                                <FieldInput
                                                    name={`sections.${sectionIndex}.points.${pointIndex}.detail`}
                                                    type="textarea"
                                                    label="Point Detail"
                                                    placeholder="Enter point detail"
                                                    required
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Section Footer */}
                <div className="bg-primary/5 p-4 text-xs text-primary flex items-start rounded-b-2xl">
                    <Info size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                        Each section requires a title, image (16:9 ratio), and at least one point.
                    </span>
                </div>
            </motion.div>
        );
    }
);

SectionItem.displayName = "SectionItem";
