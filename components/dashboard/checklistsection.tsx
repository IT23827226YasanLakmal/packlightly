"use client";
import { useState, useMemo } from "react";
import { Leaf } from "lucide-react";

export interface Item {
  name: string;
  qty?: number;
  checked?: boolean;
  eco?: boolean;
}

interface ChecklistSectionProps {
  title: string;
  items: Item[];                        // Items from parent
  removedItems: string[];               // Removed items from parent
  onRemove: (label: string) => void;    // Remove callback
  onToggleItem?: (label:string) => void;         // Optional toggle callback
}

export default function ChecklistSection({
  title,
  items,
  removedItems,
  onRemove,
  onToggleItem
}: ChecklistSectionProps) {
  const [newItemLabel, setNewItemLabel] = useState("");

  // console.log("Items: ", items);
  // Filter out removed items
  const visibleItems = useMemo(
    () => items.filter((i) => !removedItems.includes(i.name)),
    [items, removedItems]
  );


  const handleAdd = () => {
    const name = newItemLabel.trim();
    if (!name || !onToggleItem) return;
    const newItem: Item = { name };
    onToggleItem(name);
    setNewItemLabel("");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
      <h3 className="font-bold text-[#0e1b13] text-lg">{title}</h3>

      {/* Add New Item */}
      {onToggleItem && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={`Add to ${title}...`}
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            className="flex-1 border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-[#4e976b] text-white rounded hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Checklist Items */}
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {visibleItems.length === 0 && <p className="text-gray-500 text-sm">No items</p>}
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.name}</span>
              {item.eco && <Leaf size={16} className="text-green-600" />}
            </div>
            <button
              onClick={() => onRemove(item.name)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
