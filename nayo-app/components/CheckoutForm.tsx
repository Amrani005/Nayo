'use client';

import { useEffect, useState } from 'react';
import { deletDraft, placeOrder, saveDraftOrder } from '@/actions/shop';
import { wilayasData } from '@/lib/wilayasData';

type CheckoutItem = {
  id?: string;
  productId?: string;
  name?: string;
  description?: string | null;
  price: number;
  img?: string;
  size?: string;
  quantity?: number;
};

type CheckoutFormProps = {
  items: CheckoutItem[];
  onOrderComplete?: () => void;
};

export default function CheckoutForm({ items, onOrderComplete }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedWilayaID, setSelectedWilayaID] = useState<number | ''>('');
  const [deliveryType, setDeliveryType] = useState<'Domicile' | 'Stopdesk'>('Domicile');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [shippingTotal, setShippingTotal] = useState(0);
  const [extraCost, setExtraCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const subtotal = items.reduce((total, item) => total + Number(item.price) * (item.quantity || 1), 0);
  const finalTotal = subtotal + shippingTotal + extraCost;

  useEffect(() => {
    const totalItemsCount = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const extraWeight = Math.max(0, Math.floor(0.75 * totalItemsCount) - 5);
    setExtraCost(extraWeight * 50);

    const wilayaInfo = selectedWilayaID
      ? wilayasData.find((wilaya) => wilaya.IDWilaya === Number(selectedWilayaID))
      : undefined;
    setShippingTotal(wilayaInfo ? Number(wilayaInfo[deliveryType]) || 0 : 0);
  }, [items, selectedWilayaID, deliveryType]);

  useEffect(() => {
    if (!customerPhone || customerPhone.length !== 10 || items.length === 0) return;

    const timer = setTimeout(async () => {
      const wilaya = selectedWilayaID
        ? wilayasData.find((item) => item.IDWilaya === Number(selectedWilayaID))?.Wilaya
        : '';

      try {
        const result = await saveDraftOrder({
          draftId,
          cartItems: items,
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          wilaya,
          deliveryType,
          total: finalTotal,
        });
        if (result?.draftId) setDraftId(result.draftId);
      } catch (error) {
        console.error('Draft save failed', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [customerName, customerPhone, customerAddress, selectedWilayaID, deliveryType, items, finalTotal, draftId]);

  const handleCheckout = async () => {
    const cleanPhone = customerPhone
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
      .replace(/\D/g, '');

    if (!customerAddress || !selectedWilayaID) {
      setMessage('يرجى إدخال العنوان واختيار الولاية.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setMessage('يرجى إدخال رقم هاتف صحيح مكوّن من 10 أرقام.');
      return;
    }
    if (
      !cleanPhone.startsWith('07') &&
      !cleanPhone.startsWith('05') &&
      !cleanPhone.startsWith('06')
    ) {
      setMessage('يرجى إدخال رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const cityName = wilayasData.find((wilaya) => wilaya.IDWilaya === Number(selectedWilayaID))?.Wilaya || '';

    try {
      const result = await placeOrder({
        draftId,
        cartItems: items,
        productId: items[0]?.productId || items[0]?.id,
        quantity: items[0]?.quantity || 1,
        price: items[0]?.price || 0,
        productName: items[0]?.name,
        name: customerName,
        phone: cleanPhone,
        address: customerAddress,
        wilaya: cityName,
        deliveryType,
        total: finalTotal,
        size: items[0]?.size,
      });

      if (result?.success) {
        if (draftId) {
          const formData = new FormData();
          formData.append('draftId', draftId);
          await deletDraft(formData);
        }
        setDraftId(null);
        onOrderComplete?.();
        alert('تم استلام طلبك بنجاح.');
      }
    } catch (error) {
      console.error('Order submission failed', error);
      setMessage('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 border border-neutral-200 bg-white p-6 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 md:p-8">
      <h2 className="border-b border-neutral-200 pb-4 text-sm font-bold uppercase tracking-[0.2em] text-black dark:border-neutral-700 dark:text-neutral-100">
        معلومات التوصيل
      </h2>

      <div className="space-y-6">
        <div className="relative group">
          <label className="absolute top-3 origin-left -translate-y-6 scale-75 transform text-xl font-light text-neutral-600 transition-all duration-300 dark:text-neutral-400">
            الاسم الكامل
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="block w-full border-0 border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 transition-colors focus:border-black focus:outline-none dark:border-neutral-600 dark:text-neutral-100 dark:focus:border-neutral-300"
          />
        </div>

        <div className="relative group">
          <label className="absolute top-3 origin-left -translate-y-6 scale-75 transform text-xl font-light text-neutral-600 transition-all duration-300 dark:text-neutral-400">
            رقم الهاتف
          </label>
          <input
            type="tel"
            dir="ltr"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            className="block w-full border-0 border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 transition-colors focus:border-black focus:outline-none dark:border-neutral-600 dark:text-neutral-100 dark:focus:border-neutral-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <select
            value={selectedWilayaID}
            onChange={(event) => setSelectedWilayaID(Number(event.target.value))}
            className="block w-full appearance-none border-0 border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 transition-colors focus:border-black focus:outline-none dark:border-neutral-600 dark:text-neutral-100 dark:focus:border-neutral-300"
          >
            <option value="" disabled className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">الولاية</option>
            {wilayasData.map((wilaya) => (
              <option key={wilaya.IDWilaya} value={wilaya.IDWilaya} className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                {wilaya.IDWilaya} - {wilaya.Wilaya}
              </option>
            ))}
          </select>

          <div className="relative group">
            <label className="absolute top-3 origin-left -translate-y-6 scale-75 transform text-xl font-light text-neutral-600 transition-all duration-300 dark:text-neutral-400">
              العنوان بالتفصيل
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
              className="block w-full border-0 border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 transition-colors focus:border-black focus:outline-none dark:border-neutral-600 dark:text-neutral-100 dark:focus:border-neutral-300"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setDeliveryType('Domicile')}
            className={`flex-1 border py-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${deliveryType === 'Domicile' ? 'border-black bg-black text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-300 text-neutral-500 hover:border-black dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-300'}`}
          >
            التوصيل إلى المنزل
          </button>
          <button
            type="button"
            onClick={() => setDeliveryType('Stopdesk')}
            className={`flex-1 border py-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${deliveryType === 'Stopdesk' ? 'border-black bg-black text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-300 text-neutral-500 hover:border-black dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-300'}`}
          >
            التوصيل إلى مكتب الاستلام
          </button>
        </div>
      </div>

      <div className="space-y-4 border-t border-neutral-200 pt-6 dark:border-neutral-700">
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>المجموع الفرعي</span>
          <span className="font-medium text-black dark:text-neutral-100">{subtotal.toFixed(2)} DZD</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>التوصيل ({deliveryType === 'Domicile' ? 'للمنزل' : 'لمكتب الاستلام'})</span>
          <span className="font-medium text-black dark:text-neutral-100">{shippingTotal.toFixed(2)} DZD</span>
        </div>
        {extraCost > 0 && (
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>تكلفة الوزن الإضافي</span>
            <span className="font-medium text-black dark:text-neutral-100">+{extraCost.toFixed(2)} DZD</span>
          </div>
        )}
        <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-medium uppercase tracking-widest text-black dark:border-neutral-700 dark:text-neutral-100">
          <span>المجموع الكلي</span>
          <span>{finalTotal.toFixed(2)} DZD</span>
        </div>
      </div>

      {message && <p className="text-center text-xs font-bold uppercase tracking-wide text-red-500 dark:text-red-400">{message}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="flex w-full items-center justify-center gap-3 bg-black py-5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-neutral-900 dark:border-t-transparent" /> : 'تأكيد الطلب'}
      </button>
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
        الدفع عند الاستلام
      </p>
    </div>
  );
}