"use client";
import { useState, useMemo } from "react";
import { Leaf } from "lucide-react";
import { useChecklistStore, Item } from "@/store/checklistStore";

interface ChecklistSectionProps {
  title: string;
  category: string; // The category key (e.g., "Clothing")
  listId: string;   // The ID of the packing list
}

export default function ChecklistSection({
  title,
  category,
  listId,
}: ChecklistSectionProps) {
  const [newItemLabel, setNewItemLabel] = useState("");
  
  // Get state and actions from the store
  const {
    checklistCats,
    removedItems,
    toggleItem,
    removeItem,
    addItem,
    saveToServer
  } = useChecklistStore();

  // Get items for this category
  const items = checklistCats[category] || [];
  
  // Filter out removed items
  const visibleItems = useMemo(
    () => items.filter((i) => !removedItems.includes(i.name)),
    [items, removedItems]
  );

  const handleAdd = () => {
    const name = newItemLabel.trim();
    if (!name) return;
    
    const newItem: Item = { name, checked: false, eco: false };
    addItem(category, newItem);
    setNewItemLabel("");
    
    // Save to server
    saveToServer(listId, category);
  };

  const handleToggle = (itemName: string, checked: boolean) => {
    toggleItem(category, itemName, checked);
    
    // Save to server
    saveToServer(listId, category);
  };

  const handleRemove = (itemName: string) => {
    removeItem(category, itemName);
    
    // Save to server
    saveToServer(listId, category);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
      <h3 className="font-bold text-[#0e1b13] text-lg">{title}</h3>

      {/* Add New Item */}
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

      {/* Checklist Items */}
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {visibleItems.length === 0 && <p className="text-gray-500 text-sm">No items</p>}
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked || false}
                onChange={(e) => handleToggle(item.name, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">{item.name}</span>
              {item.eco && <Leaf size={16} className="text-green-600" />}
            </div>
            <button
              onClick={() => handleRemove(item.name)}
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