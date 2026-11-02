'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { placeOrder, saveDraftOrder } from '@/actions/shop';
import { wilayasData } from '@/lib/wilayasData';

type CheckoutItem = {
  id?: string;
  productId?: string;
  name?: string;
  description?: string | null;
  price: number;
  img?: string;
  size?: string;
  availableSizes?: string[];
  quantity?: number;
};

type CheckoutFormProps = {
  items: CheckoutItem[];
  onOrderComplete?: () => void;
  size?: string | null;
  onSizeChange?: (size: string) => void;
};

export default function CheckoutForm({ items, onOrderComplete, size, onSizeChange }: CheckoutFormProps) {
  const [quantities, setQuantities] = useState(() => items.map((item) => Math.max(1, item.quantity ?? 1)));
  const [selectedSizes, setSelectedSizes] = useState(() => items.map((item) =>
    Array.from({ length: Math.max(1, item.quantity ?? 1) }, () => item.size ?? '')
  ));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedWilayaID, setSelectedWilayaID] = useState<number | ''>('');
  const [deliveryType, setDeliveryType] = useState<'Domicile' | 'Stopdesk'>('Domicile');
  const draftIdRef = useRef<string | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraftSaveRef = useRef<Promise<string | null> | null>(null);
  const orderCompletedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const orderItems = useMemo(() => items.map((item, index) => {
    const quantity = Math.max(1, quantities[index] ?? item.quantity ?? 1);
    const sizes = Array.from({ length: quantity }, (_, unitIndex) =>
      selectedSizes[index]?.[unitIndex] || (index === 0 ? size : '') || item.size || ''
    );
    return {
      ...item,
      quantity,
      size: sizes[0] || '',
      sizes,
    };
  }), [items, quantities, selectedSizes, size]);
  const totalItemsCount = orderItems.reduce((total, item) => total + item.quantity, 0);
  const extraWeight = Math.max(0, Math.floor(0.75 * totalItemsCount) - 5);
  const extraCost = extraWeight * 50;
  const selectedWilaya = selectedWilayaID
    ? wilayasData.find((wilaya) => wilaya.IDWilaya === Number(selectedWilayaID))
    : undefined;
  const shippingTotal = selectedWilaya
    ? Number(selectedWilaya[deliveryType]) || 0
    : 0;
  const subtotal = orderItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  const finalTotal = subtotal + shippingTotal + extraCost;

  const saveCurrentDraft = useCallback(async (currentDraftId: string | null) => {
    const wilaya = selectedWilayaID
      ? wilayasData.find((item) => item.IDWilaya === Number(selectedWilayaID))?.Wilaya
      : '';
    const result = await saveDraftOrder({
      draftId: currentDraftId,
      cartItems: orderItems,
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      wilaya,
      deliveryType,
      total: finalTotal,
      productId: items[0]?.productId || items[0]?.id,
      quantity: orderItems[0]?.quantity ?? 1,
      price: items[0]?.price || 0,
      productName: items[0]?.name,
      size: orderItems[0]?.size,
    });

    if (!result?.draftId) {
      throw new Error('Saving the checkout draft did not return an ID.');
    }

    draftIdRef.current = result.draftId;
    return result.draftId;
  }, [selectedWilayaID, items, orderItems, customerName, customerPhone, customerAddress, deliveryType, finalTotal]);

  useEffect(() => {
    if (orderCompletedRef.current || isLoading || !customerPhone || customerPhone.length !== 10 || items.length === 0) return;

    draftTimerRef.current = setTimeout(() => {
      const previousSave = pendingDraftSaveRef.current ?? Promise.resolve(null);
      const savePromise = previousSave
        .catch(() => null)
        .then(() => saveCurrentDraft(draftIdRef.current));
      pendingDraftSaveRef.current = savePromise;
      void savePromise
        .catch((error: unknown) => console.error('Draft save failed', error))
        .finally(() => {
          if (pendingDraftSaveRef.current === savePromise) {
            pendingDraftSaveRef.current = null;
          }
        });
    }, 1000);

    return () => {
      if (draftTimerRef.current) {
        clearTimeout(draftTimerRef.current);
        draftTimerRef.current = null;
      }
    };
  }, [customerPhone, items.length, isLoading, saveCurrentDraft]);

  const handleCheckout = async () => {
    if (orderCompletedRef.current || isLoading) return;
    if (orderItems.some((item) =>
      item.availableSizes?.length && item.sizes.some((itemSize) => !itemSize)
    )) {
      setMessage('يرجى اختيار مقاس لكل قطعة قبل إتمام الطلب.');
      return;
    }
    const cleanPhone = customerPhone
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
      .replace(/\D/g, '');
    if (!customerAddress || !selectedWilayaID) {
      setMessage('يرجى إدخال العنوان واختيار الولاية.');
      return;
    }
    if (customerPhone.length !== 10) {
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
      if (draftTimerRef.current) {
        clearTimeout(draftTimerRef.current);
        draftTimerRef.current = null;
      }
      await pendingDraftSaveRef.current;

      const result = await placeOrder({
        draftId: draftIdRef.current,
        cartItems: orderItems,
        productId: items[0]?.productId || items[0]?.id,
        quantity: orderItems[0]?.quantity ?? 1,
        price: items[0]?.price || 0,
        productName: items[0]?.name,
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        wilaya: cityName,
        deliveryType,
        total: finalTotal,
        size: orderItems[0]?.size,
      });

      if (result?.success) {
        orderCompletedRef.current = true;
        draftIdRef.current = null;
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

          <div className="relative group ">
            <label className="absolute top-2 origin-left -translate-y-6 scale-75 transform text-xl font-light text-neutral-600 transition-all duration-300 dark:text-neutral-400">
              العنوان 
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
              className="block w-full border-0 border-b border-neutral-300 bg-transparent py-3 text-sm font-light text-neutral-900 transition-colors focus:border-black focus:outline-none dark:border-neutral-600 dark:text-neutral-100 dark:focus:border-neutral-300"
            />
          </div>
        </div>

        <div className="space-y-4 border-b border-neutral-200 pb-4 dark:border-neutral-700">
          {orderItems.map((item, index) => {
            const availableSizes = item.availableSizes ?? [];
            return (
            <div key={`${item.productId || item.id || 'item'}-${index}`} className="space-y-3">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {item.name || `المنتج ${index + 1}`}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">الكمية</span>
                <div className="flex items-center gap-4" dir="ltr">
                  <button
                    type="button"
                    onClick={() => {
                      const nextQuantity = Math.max(1, item.quantity - 1);
                      setQuantities((current) => current.map((value, itemIndex) =>
                        itemIndex === index ? nextQuantity : value
                      ));
                      setSelectedSizes((current) => current.map((unitSizes, itemIndex) =>
                        itemIndex === index ? unitSizes.slice(0, nextQuantity) : unitSizes
                      ));
                    }}
                    disabled={isLoading || item.quantity <= 1}
                    aria-label={`تقليل كمية ${item.name || `المنتج ${index + 1}`}`}
                    className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-lg transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:hover:border-neutral-300"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuantities((current) => current.map((value, itemIndex) =>
                        itemIndex === index ? value + 1 : value
                      ));
                      setSelectedSizes((current) => current.map((unitSizes, itemIndex) =>
                        itemIndex === index
                          ? [...unitSizes, index === 0 ? size || '' : item.size || '']
                          : unitSizes
                      ));
                    }}
                    disabled={isLoading}
                    aria-label={`زيادة كمية ${item.name || `المنتج ${index + 1}`}`}
                    className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-lg transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:hover:border-neutral-300"
                  >
                    +
                  </button>
                </div>
              </div>
              {availableSizes.length > 0 && item.sizes.map((unitSize, unitIndex) => (
                <div key={`${item.productId || item.id || index}-unit-${unitIndex}`} className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    القطعة {unitIndex + 1} - المقاس:
                  </span>
                  {availableSizes.map((availableSize) => (
                    <button
                      key={availableSize}
                      type="button"
                      onClick={() => {
                        if (index === 0 && unitIndex === 0 && onSizeChange) {
                          onSizeChange(availableSize);
                        }
                        setSelectedSizes((current) => current.map((unitSizes, itemIndex) =>
                          itemIndex === index
                            ? unitSizes.map((currentSize, currentUnit) =>
                                currentUnit === unitIndex ? availableSize : currentSize
                              )
                            : unitSizes
                        ));
                      }}
                      disabled={isLoading}
                      aria-pressed={unitSize === availableSize}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        unitSize === availableSize
                          ? 'border-black bg-black text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                          : 'border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {availableSize}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            );
          })}
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