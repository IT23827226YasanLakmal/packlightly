"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Move, Check } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Trip { id: string; name: string; }
interface PackingList { id: string; title: string; description: string; tripId: string; itemsCount: number; }

export default function PackingListsPage() {
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchedTrips: Trip[] = [
      { id: "1", name: "Paris Trip" },
      { id: "2", name: "Beach Holiday" },
    ];
    setTrips(fetchedTrips);

    const fetchedLists: PackingList[] = [
      { id: "a1", title: "Winter Packing", description: "Warm clothes and accessories", tripId: "1", itemsCount: 12 },
      { id: "a2", title: "Summer Essentials", description: "Light clothing and sunscreen", tripId: "2", itemsCount: 8 },
    ];
    setPackingLists(fetchedLists);
  }, []);

  const handleDeleteList = (id: string) => {
    setPackingLists(prev => prev.filter(list => list.id !== id));
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  };

  const handleBulkDelete = () => {
    setPackingLists(prev => prev.filter(list => !selectedIds.includes(list.id)));
    setSelectedIds([]);
  };

  const filteredLists = packingLists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(packingLists);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPackingLists(items);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-[#0e1b13]">Packing Lists</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search lists..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            onClick={() => router.push("/create-packinglist")}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            <Plus size={18} /> New List
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:bg-red-600 transition"
            >
              <Trash2 size={18} /> Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Packing List Cards */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <AnimatePresence>
                {filteredLists.map((list, index) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative flex flex-col justify-between p-5 bg-white rounded-2xl shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden ${
                          snapshot.isDragging ? "bg-green-50 shadow-2xl" : ""
                        }`}
                      >
                        {/* Selection Checkbox */}
                        <div
                          className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-colors ${
                            selectedIds.includes(list.id) ? "bg-green-500 border-green-500" : "bg-white"
                          }`}
                          onClick={(e) => { e.stopPropagation(); toggleSelect(list.id); }}
                        >
                          {selectedIds.includes(list.id) && <Check size={16} className="text-white" />}
                        </div>

                        {/* Card Content */}
                        <div onClick={() => router.push(`/packinglist-overview?id=${list.id}`)}>
                          <h2 className="text-lg font-bold text-[#0e1b13]">{list.title}</h2>
                          <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                          <p className="text-sm text-green-600 mt-1">
                            Trip: {trips.find(t => t.id === list.tripId)?.name}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-green-600">{list.itemsCount} items</span>
                          <div className="flex items-center gap-2">
                            <Move size={18} className="text-gray-400 opacity-60 hover:opacity-100 transition" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                              className="text-red-500 hover:text-red-600 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Floating Overlay */}
                        <div className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none bg-gradient-to-t from-green-100 via-transparent to-transparent opacity-20 animate-floating-slow"></div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnimatePresence>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <style jsx>{`
        @keyframes floatingSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-floating-slow { animation: floatingSlow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
