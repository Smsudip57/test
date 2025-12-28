import React, { useRef, useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useUploadFileMutation } from "../../Redux/Api/fileApi";
import Image from "next/image";
import { Upload, X, ImageIcon, AlertCircle, CheckCircle, Plus } from "lucide-react";

export type FileInputProps = {
    name: string;
    label?: string;
    value?: string | File | (string | File)[] | null;
    onValueChange?: (val: string | File | (string | File)[] | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    required?: boolean;
    accept?: string;
    multiple?: boolean;
    // Dimension validation props
    dimensions?: {
        width: number;
        height: number;
    };
    tolerance?: number; // percentage tolerance (e.g., 5 for 5%)
    // ...rest
    [key: string]: any;
};

// Helper function to validate image dimensions
const validateImageDimensions = (
    file: File,
    dimensions?: { width: number; height: number },
    tolerance: number = 0
): Promise<{ valid: boolean; message?: string; actualDimensions?: { width: number; height: number } }> => {
    return new Promise((resolve) => {
        if (!dimensions) {
            resolve({ valid: true });
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.onload = function () {
                const actualWidth = img.width;
                const actualHeight = img.height;
                const { width: expectedWidth, height: expectedHeight } = dimensions;

                // Calculate tolerance range
                const widthTolerance = (expectedWidth * tolerance) / 100;
                const heightTolerance = (expectedHeight * tolerance) / 100;

                const minWidth = expectedWidth - widthTolerance;
                const maxWidth = expectedWidth + widthTolerance;
                const minHeight = expectedHeight - heightTolerance;
                const maxHeight = expectedHeight + heightTolerance;

                const isValidWidth = actualWidth >= minWidth && actualWidth <= maxWidth;
                const isValidHeight = actualHeight >= minHeight && actualHeight <= maxHeight;

                if (isValidWidth && isValidHeight) {
                    resolve({ valid: true, actualDimensions: { width: actualWidth, height: actualHeight } });
                } else {
                    const expectedRatio = expectedWidth / expectedHeight;
                    const actualRatio = actualWidth / actualHeight;
                    resolve({
                        valid: false,
                        message: `Image dimensions must be ${expectedWidth}x${expectedHeight} (±${tolerance}%). Uploaded: ${actualWidth}x${actualHeight}. Expected aspect ratio: ${expectedRatio.toFixed(2)}:1, Got: ${actualRatio.toFixed(2)}:1`,
                        actualDimensions: { width: actualWidth, height: actualHeight }
                    });
                }
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};

function FileInputRHF(props: FileInputProps) {
    const {
        name,
        label,
        value,
        onValueChange,
        placeholder,
        disabled,
        className = "",
        inputClassName = "",
        required = false,
        accept = "image/*",
        multiple = false,
        dimensions,
        tolerance = 5, // Default 5% tolerance
        ...rest
    } = props;
    const { control, setValue, formState: { errors }, watch } = useFormContext();
    const [uploadFile, { isLoading }] = useUploadFileMutation();
    const [progress, setProgress] = useState<number>(0);
    const [localError, setLocalError] = useState<string>("");

    // Watch the form field value to update preview when form resets
    const fieldValue = watch(name);

    const [preview, setPreview] = useState<string[] | null>(
        value
            ? Array.isArray(value)
                ? value.map((v) => (typeof v === "string" ? v : URL.createObjectURL(v as File)))
                : [typeof value === "string" ? value : URL.createObjectURL(value as File)]
            : null
    );

    // Update preview when field value changes (e.g., from form reset)
    useEffect(() => {
        if (fieldValue) {
            const newPreview = Array.isArray(fieldValue)
                ? fieldValue.map((v) => (typeof v === "string" ? v : URL.createObjectURL(v as File)))
                : [typeof fieldValue === "string" ? fieldValue : URL.createObjectURL(fieldValue as File)];
            setPreview(newPreview);
        } else if (fieldValue === "" || fieldValue === null || fieldValue === undefined) {
            setPreview(null);
        }
    }, [fieldValue]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const errorMsg = errors?.[name]?.message as string | undefined;

    const showToast = (message: string, type: 'error' | 'success' = 'error') => {
        // Integrate with your toast system if needed
        if (type === 'error') {
            setLocalError(message);
            setTimeout(() => setLocalError(""), 5000);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (val: string | string[]) => void) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLocalError("");

        // Validate dimensions for each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/') && dimensions) {
                const validation = await validateImageDimensions(file, dimensions, tolerance);
                if (!validation.valid) {
                    showToast(validation.message || "Invalid image dimensions", 'error');
                    e.target.value = ""; // Clear the input
                    return;
                }
            }
        }

        setProgress(0);
        let previews: string[] = [];
        let urls: string[] = [];
        let uploading = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            previews.push(URL.createObjectURL(file));
            // Upload file
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await uploadFile(formData).unwrap();
                urls.push(res.url);
                showToast(`File uploaded successfully!`, 'success');
            } catch (uploadError) {
                urls.push("");
                showToast(`Failed to upload ${file.name}`, 'error');
            }
            uploading++;
            setProgress(Math.round((uploading / files.length) * 100));
        }
        setPreview(previews);
        setProgress(100);
        const resultVal = multiple ? urls : urls[0] || "";
        setValue(name, resultVal);
        onValueChange?.(resultVal);
        fieldOnChange(resultVal);
    };

    const handleRemove = (fieldOnChange: (val: string | string[]) => void, idx?: number) => {
        if (multiple && Array.isArray(preview)) {
            const newPreviews = [...preview];
            newPreviews.splice(idx!, 1);
            setPreview(newPreviews);
            setValue(name, newPreviews);
            onValueChange?.(newPreviews);
            fieldOnChange(newPreviews);
        } else {
            setPreview(null);
            setValue(name, multiple ? [] : "");
            onValueChange?.(multiple ? [] : null);
            fieldOnChange(multiple ? [] : "");
        }
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className={`relative ${className}`}>
                    {/* Label */}

                    {label && (
                        <div className="flex items-center mb-3">
                            <label className="block text-sm font-semibold text-gray-800 mr-2">
                                {label}
                                {required && <span className="text-red-500 ml-1">*</span>}
                                {dimensions && (
                                    <span className="text-xs font-normal text-gray-500 ml-2">
                                        ({dimensions.width}x{dimensions.height} ±{tolerance}%)
                                    </span>
                                )}
                            </label>
                            {errorMsg && (
                                <span className="flex items-center text-sm text-red-700 ml-2">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mr-1" size={16} />
                                    {errorMsg}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Error Message: local (dimension/upload) */}
                    {localError && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-red-700">{localError}</p>
                        </div>
                    )}
                    {/* Error Message: Zod/RHF validation */}
                    {/* {errorMsg && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-red-700">{errorMsg}</p>
                        </div>
                    )} */}

                    {/* Upload Area - Fixed Height Container */}
                    <div className="relative min-h-[200px]">
                        {preview && preview.length > 0 ? (
                            <div className="space-y-4">
                                {/* Single image preview for non-multiple mode */}
                                {!multiple ? (
                                    <div className="relative group w-full">
                                        <div
                                            className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 w-full"
                                            style={{
                                                aspectRatio: dimensions
                                                    ? `${dimensions.width} / ${dimensions.height}`
                                                    : "16 / 9",
                                                minHeight: "200px"
                                            }}
                                        >
                                            <Image
                                                src={preview[0]}
                                                alt="Preview"
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(field.onChange)}
                                                disabled={isLoading}
                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        {/* Replace button */}
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={disabled || isLoading}
                                                className="w-full py-2 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
                                            >
                                                <Upload className="inline mr-2" size={14} />
                                                Replace Image
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Multiple images grid */
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {preview.map((src, idx) => {
                                                // Calculate aspect ratio from dimensions prop
                                                let aspectRatio = "1 / 1";
                                                if (dimensions && dimensions.width && dimensions.height) {
                                                    aspectRatio = `${dimensions.width} / ${dimensions.height}`;
                                                }
                                                return (
                                                    <div key={src + idx} className="relative group">
                                                        <div
                                                            className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50"
                                                            style={{ aspectRatio }}
                                                        >
                                                            <Image
                                                                src={src}
                                                                alt={`Preview ${idx + 1}`}
                                                                fill
                                                                className="object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemove(field.onChange, idx)}
                                                                disabled={isLoading}
                                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Add More Button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={disabled || isLoading}
                                            className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium"
                                        >
                                            <Plus className="inline mr-2" size={16} />
                                            Add More Files
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
                                className={`
                                    relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer h-full min-h-[200px] flex items-center justify-center
                                    ${disabled || isLoading
                                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                        : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                                    }
                                    ${(localError || errorMsg) ? 'border-red-300 bg-red-50' : ''}
                                `}
                            >
                                <div className="p-6 text-center">
                                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${(localError || errorMsg) ? 'bg-red-100' : 'bg-blue-100'
                                        }`}>
                                        {isLoading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                        ) : (
                                            <Upload className={`w-6 h-6 ${(localError || errorMsg) ? 'text-red-500' : 'text-blue-500'}`} />
                                        )}
                                    </div>

                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                        {isLoading ? 'Uploading...' : (placeholder || 'Upload Files')}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-3">
                                        {multiple ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 rounded">
                                            {accept.includes('image') ? 'Images only' : accept || 'All files'}
                                        </span>
                                        {dimensions && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                {dimensions.width}×{dimensions.height}
                                            </span>
                                        )}
                                        {tolerance > 0 && (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                                ±{tolerance}% tolerance
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {isLoading && progress > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            className="hidden"
                            disabled={disabled || isLoading}
                            onChange={e => handleFileChange(e, field.onChange)}
                            {...rest}
                        />
                    </div>
                </div>
            )}
        />
    );
}

function FileInputControlled(props: FileInputProps) {
    const {
        name,
        label,
        value,
        onValueChange,
        placeholder,
        disabled,
        className = "",
        inputClassName = "",
        required = false,
        accept = "image/*",
        multiple = false,
        dimensions,
        tolerance = 5,
        ...rest
    } = props;
    const [preview, setPreview] = useState<string[]>(
        value
            ? Array.isArray(value)
                ? value.map((v) => (typeof v === "string" ? v : URL.createObjectURL(v as File)))
                : [typeof value === "string" ? value : URL.createObjectURL(value as File)]
            : []
    );

    // Update preview when value prop changes
    useEffect(() => {
        if (value) {
            const newPreview = Array.isArray(value)
                ? value.map((v) => (typeof v === "string" ? v : URL.createObjectURL(v as File)))
                : [typeof value === "string" ? value : URL.createObjectURL(value as File)];
            setPreview(newPreview);
        } else {
            setPreview([]);
        }
    }, [value]);

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadFile] = useUploadFileMutation();

    const showToast = (message: string, type: 'error' | 'success' = 'error') => {
        if (type === 'error') {
            setError(message);
            setTimeout(() => setError(""), 5000);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError("");
        setIsLoading(true);

        // Validate dimensions for each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/') && dimensions) {
                const validation = await validateImageDimensions(file, dimensions, tolerance);
                if (!validation.valid) {
                    showToast(validation.message || "Invalid image dimensions", 'error');
                    e.target.value = "";
                    setIsLoading(false);
                    return;
                }
            }
        }

        setProgress(0);
        let previews: string[] = [];
        let urls: string[] = [];
        let uploading = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            previews.push(URL.createObjectURL(file));
            // Upload file
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await uploadFile(formData).unwrap();
                urls.push(res.url);
            } catch {
                urls.push("");
                showToast(`Failed to upload ${file.name}`, 'error');
            }
            uploading++;
            setProgress(Math.round((uploading / files.length) * 100));
        }
        setPreview(previews);
        setProgress(100);
        setIsLoading(false);
        const resultVal = multiple ? urls : urls[0] || "";
        onValueChange?.(resultVal);
    };

    const handleRemove = (idx?: number) => {
        if (multiple && Array.isArray(preview)) {
            const newPreviews = [...preview];
            newPreviews.splice(idx!, 1);
            setPreview(newPreviews);
            onValueChange?.(newPreviews);
        } else {
            setPreview([]);
            onValueChange?.(multiple ? [] : null);
        }
        setProgress(0);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={`relative ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {dimensions && (
                        <span className="text-xs font-normal text-gray-500 ml-2">
                            ({dimensions.width}x{dimensions.height} ±{tolerance}%)
                        </span>
                    )}
                </label>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Upload Area - Fixed Height Container */}
            <div className="relative min-h-[200px]">
                {preview && preview.length > 0 ? (
                    <div className="space-y-4">
                        {/* Single image preview for non-multiple mode */}
                        {!multiple ? (
                            <div className="relative group w-full">
                                <div
                                    className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 w-full"
                                    style={{
                                        aspectRatio: dimensions
                                            ? `${dimensions.width} / ${dimensions.height}`
                                            : "16 / 9",
                                        minHeight: "200px"
                                    }}
                                >
                                    <Image
                                        src={preview[0]}
                                        alt="Preview"
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemove()}
                                        disabled={isLoading}
                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {/* Replace button */}
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={disabled || isLoading}
                                        className="w-full py-2 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
                                    >
                                        <Upload className="inline mr-2" size={14} />
                                        Replace Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Multiple images grid */
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {preview.map((src, idx) => (
                                        <div key={src + idx} className="relative group">
                                            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                                                <Image
                                                    src={src}
                                                    alt={`Preview ${idx + 1}`}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(idx)}
                                                    disabled={isLoading}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add More Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={disabled || isLoading}
                                    className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium"
                                >
                                    <Plus className="inline mr-2" size={16} />
                                    Add More Files
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer h-full min-h-[200px] flex items-center justify-center
                            ${disabled || isLoading
                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                            }
                            ${error ? 'border-red-300 bg-red-50' : ''}
                        `}
                    >
                        <div className="p-6 text-center">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${error ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                ) : (
                                    <Upload className={`w-6 h-6 ${error ? 'text-red-500' : 'text-blue-500'}`} />
                                )}
                            </div>

                            <h3 className="text-base font-semibold text-gray-800 mb-2">
                                {isLoading ? 'Uploading...' : (placeholder || 'Upload Files')}
                            </h3>

                            <p className="text-sm text-gray-600 mb-3">
                                {multiple ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                    {accept.includes('image') ? 'Images only' : accept || 'All files'}
                                </span>
                                {dimensions && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {dimensions.width}×{dimensions.height}
                                    </span>
                                )}
                                {tolerance > 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                        ±{tolerance}% tolerance
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {isLoading && progress > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    disabled={disabled || isLoading}
                    onChange={handleFileChange}
                    {...rest}
                />
            </div>
        </div>
    );
}

export const FileInput: React.FC<FileInputProps> = (props) => {
    try {
        useFormContext();
        return <FileInputRHF {...props} />;
    } catch {
        return <FileInputControlled {...props} />;
    }
};

export default FileInput;
