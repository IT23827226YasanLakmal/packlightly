"use client";
import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { getAuth } from "firebase/auth";


async function apiFetch(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

interface ChecklistItem {
  id: string;
  label: string;
  completed?: boolean;
  eco?: boolean;
}

interface ChecklistSectionProps {
  title: string;
}

export default function ChecklistSection({ title }: ChecklistSectionProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [removedItems, setRemovedItems] = useState<ChecklistItem[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemEco, setNewItemEco] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "eco" | "completed" | "removed">("all");

 // ✅ Fetch initial data from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("https://localhost:5000/api/checklist");
        const data = await res.json();
        setChecklistItems(data);
      } catch (err) {
        console.error("Failed to load checklist:", err);
      }
    })();
  }, []);

  // ✅ Toggle complete
  const toggleComplete = async (item: ChecklistItem) => {
    const updated = { ...item, completed: !item.completed };
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === item.id ? updated : i))
    );
    try {
      await apiFetch(`https://localhost:5000/api/checklist/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: updated.completed }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Remove
  const removeItem = async (item: ChecklistItem) => {
    setRemovedItems([item, ...removedItems]);
    setChecklistItems(checklistItems.filter((i) => i.id !== item.id));
    try {
      await apiFetch(`https://localhost:5000/api/checklist/${item.id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Restore
  const restoreItem = async (item: ChecklistItem) => {
    setChecklistItems([item, ...checklistItems]);
    setRemovedItems(removedItems.filter((i) => i.id !== item.id));
    try {
      await apiFetch(`https://localhost:5000/api/checklist/${item.id}/restore`, { method: "PATCH" });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add new item
  const addItem = async () => {
    if (!newItemLabel.trim()) return;
    const newItem = {
      id: crypto.randomUUID(),
      label: newItemLabel,
      completed: false,
      eco: newItemEco,
    };
    setChecklistItems([newItem, ...checklistItems]);
    setNewItemLabel("");
    setNewItemEco(false);
    try {
      await apiFetch("https://localhost:5000/api/checklist", {
        method: "POST",
        body: JSON.stringify(newItem),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filtered items
  const filteredItems = () => {
    switch (activeTab) {
      case "eco":
        return checklistItems.filter((item) => item.eco);
      case "completed":
        return checklistItems.filter((item) => item.completed);
      case "removed":
        return removedItems;
      default:
        return checklistItems;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
      <h3 className="font-bold text-[#0e1b13] text-lg">{title}</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-3 text-sm">
        {["all", "eco", "completed", "removed"].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full font-medium transition ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add New Item */}
      {activeTab !== "removed" && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Add new item"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1"
          />
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={newItemEco} onChange={() => setNewItemEco(!newItemEco)} />
            <Leaf size={16} className="text-green-600" />
          </label>
          <button
            onClick={addItem}
            className="px-3 py-1 bg-[#4e976b] text-white rounded hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Checklist Items */}
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {filteredItems().length === 0 && <p className="text-gray-500 text-sm">No items to display</p>}
        {filteredItems().map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 transition">
            <div className="flex items-center gap-2">
              {activeTab !== "removed" && (
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item)}
                />
              )}
              <span className={`text-sm ${item.completed ? "line-through text-gray-400" : ""}`}>
                {item.label}
              </span>
              {item.eco && <Leaf size={16} className="text-green-600" />}
            </div>
            {activeTab === "removed" ? (
              <button
                onClick={() => restoreItem(item)}
                className="text-green-600 text-sm hover:underline"
              >
                Restore
              </button>
            ) : (
              <button
                onClick={() => removeItem(item)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
