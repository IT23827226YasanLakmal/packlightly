"use client";
import { useState } from "react";
import { Leaf } from "lucide-react";
import Button from "@/components/dashboard/button";

interface ChecklistItem {
  label: string;
  completed?: boolean;
  eco?: boolean;
}

interface ChecklistSectionProps {
  title: string;
  items: (string | ChecklistItem)[];
  ecoItems?: string[]; // for highlighting eco items
}

export default function ChecklistSection({ title, items, ecoItems = [] }: ChecklistSectionProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    items.map((item) =>
      typeof item === "string" ? { label: item, completed: false, eco: ecoItems.includes(item) } : item
    )
  );

  const [removedItems, setRemovedItems] = useState<ChecklistItem[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemEco, setNewItemEco] = useState(false);

  const toggleComplete = (index: number) => {
    const updated = [...checklistItems];
    updated[index].completed = !updated[index].completed;
    setChecklistItems(updated);
  };

  const removeItem = (index: number) => {
    const removed = checklistItems.splice(index, 1)[0];
    setRemovedItems([removed, ...removedItems]);
    setChecklistItems([...checklistItems]);
  };

  const restoreItem = (index: number) => {
    const restored = removedItems.splice(index, 1)[0];
    setChecklistItems([restored, ...checklistItems]);
    setRemovedItems([...removedItems]);
  };

  const addItem = () => {
    if (newItemLabel.trim() === "") return;
    setChecklistItems([{ label: newItemLabel, completed: false, eco: newItemEco }, ...checklistItems]);
    setNewItemLabel("");
    setNewItemEco(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4 ">
      <h3 className="font-bold text-[#0e1b13]">{title}</h3>

      {/* Add New Item */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Add new item"
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-2 py-1"
        />
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={newItemEco}
            onChange={() => setNewItemEco(!newItemEco)}
          />
          <Leaf size={16} className="text-green-600" />
        </label>
        <button
          onClick={addItem}
          className="px-3 py-1 bg-[#4e976b] text-white rounded hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {/* Checklist Items */}
      <div className="flex flex-col gap-2">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(idx)}
              />
              <span className={`text-sm ${item.completed ? "line-through text-gray-400" : ""}`}>
                {item.label}
              </span>
              {item.eco && <Leaf size={16} className="text-green-600" />}
            </div>
            <button
              onClick={() => removeItem(idx)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Removed Items */}
      {removedItems.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Removed Items</h4>
          <div className="flex flex-col gap-1">
            {removedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="text-sm">{item.label}</span>
                <button
                  onClick={() => restoreItem(idx)}
                  className="text-green-600 text-sm hover:underline"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>

  );
}
