import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Usage: <QuotationDialogue trigger={<button>Open</button>} ... />
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function QuotationDialogue({
  odoo_id,
  body,
  products = [],
  onPay,
  trigger,
}) {
  // products: [{ image, title, price, quantity, total_amount }]
  const total = products.reduce(
    (sum, item) => sum + (item.total_amount || 0),
    0
  );
  const validity = body?.validity_date;
  const untaxed = body?.amount_untaxed;
  const tax = body?.amount_tax;
  const grandTotal = body?.amount_total;
  const currency = body?.currency_id || "AED";
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    if (!odoo_id) {
      alert("Quotation ID (odoo_id) is missing.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/payment/create",
        { odoo_id },
        { withCredentials: true }
      );
      const data = res.data;
      if (data.success && data.paymentUrl) {
        if (typeof window !== "undefined") {
          window.open(data.paymentUrl, "_blank");
        }
      }
    } catch (err) {
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="relative">
          <DialogTitle>Quotation Details</DialogTitle>
          <DialogDescription>
            Please review your products before proceeding to payment.
          </DialogDescription>
          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DialogClose>
        </DialogHeader>
        {validity && (
          <div className="mb-2 text-sm text-gray-600">
            <span className="font-semibold">Valid till:</span> {validity}
          </div>
        )}
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {products.length === 0 ? (
            <div className="text-gray-500 text-center">
              No products in quotation.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {products.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 py-3">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[#446E6D]">
                      {item.title}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Quantity:{" "}
                      <span className="font-semibold">{item.quantity}</span>{" "}
                      &nbsp;|&nbsp; Price per item:{" "}
                      <span className="font-semibold">
                        {item.price} {currency}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      Total:{" "}
                      <span className="font-semibold">
                        {item.total_amount} {currency}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {products.length > 0 && (
          <div className="mt-4 text-right text-base text-gray-700 space-y-1">
            <div>
              <span className="font-semibold">Untaxed Amount:</span> {untaxed}{" "}
              {currency}
            </div>
            <div>
              <span className="font-semibold">Tax:</span> {tax} {currency}
            </div>
            <div className="text-lg font-bold text-[#446E6D]">
              Grand Total: {grandTotal} {currency}
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <button
              className="w-full mt-4 px-4 py-2 bg-[#446E6D] text-white rounded hover:bg-[#355857] transition"
              disabled={products.length === 0 || loading}
              onClick={handlePay}
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
