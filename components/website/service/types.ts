export type ServiceCategory =
    | "Branding"
    | "Workfrom Anywhere"
    | "Modern Workplace"
    | "Digital"
    | "Endless Support";

export interface ServiceFormValues {
    Title: string;
    Name: string;
    slug: string;
    detail: string;
    moreDetail: string;
    category: ServiceCategory | "";
    image: string;
}

export interface ServiceItem {
    _id: string;
    Title: string;
    Name: string;
    slug: string;
    deltail: string;
    moreDetail: string;
    category: ServiceCategory;
    image: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
    "Branding",
    "Workfrom Anywhere",
    "Modern Workplace",
    "Digital",
    "Endless Support",
];

export const DEFAULT_SERVICE_FORM_VALUES: ServiceFormValues = {
    Title: "",
    Name: "",
    slug: "",
    detail: "",
    moreDetail: "",
    category: "",
    image: "",
};
