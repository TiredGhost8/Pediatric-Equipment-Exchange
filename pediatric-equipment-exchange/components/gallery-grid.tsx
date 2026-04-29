"use client";

import EquipmentCard from "@/components/equipment-card";
import { ItemFields } from "@/field_interfaces";
import { useState } from "react";
import { CATEGORY_OPTIONS } from "@/item-field-options";

interface Props {
    items: ItemFields[];
}

export default function GalleryGrid({ items }: Props) {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

    // Get unique values for filter dropdowns from actual data
    const dataCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
    const categories = [...CATEGORY_OPTIONS.filter(cat => cat !== "Other").sort(), "Other"];
    const statuses = [...new Set(items.map(item => item.status).filter(Boolean))].sort();
    const conditions = [...new Set(items.map(item => item.condition).filter(Boolean))].sort();

    // Toggle a value in a multi-select filter
    const toggleFilter = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(v => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    // Filter items based on all active filters
    const itemMatches = items.filter((item) => {
        const searchIgnoreCase = searchTerm.toLowerCase();
        const nameMatches = item.name.toLowerCase().includes(searchIgnoreCase);
        const categoryMatches = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const statusMatches = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
        const conditionMatches = selectedConditions.length === 0 || selectedConditions.includes(item.condition);
        return nameMatches && categoryMatches && statusMatches && conditionMatches;
    });

    const hasActiveFilters = selectedCategories.length > 0 || selectedStatuses.length > 0 || selectedConditions.length > 0 || searchTerm;

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedStatuses([]);
        setSelectedConditions([]);
    };

    // All active filter tags combined
    const allActiveTags = [
        ...selectedCategories.map(v => ({ value: v, type: "category" })),
        ...selectedStatuses.map(v => ({ value: v, type: "status" })),
        ...selectedConditions.map(v => ({ value: v, type: "condition" })),
    ];

    const removeTag = (value: string, type: string) => {
        if (type === "category") setSelectedCategories(selectedCategories.filter(v => v !== value));
        if (type === "status") setSelectedStatuses(selectedStatuses.filter(v => v !== value));
        if (type === "condition") setSelectedConditions(selectedConditions.filter(v => v !== value));
    };

    return (
        <div className="flex flex-col min-h-0 w-full gap-4">

            {/* Search + Filters box */}
            <div className="flex flex-col gap-3 bg-white rounded-3xl p-4">

                {/* Search bar */}
                <div className="w-full">
                    <div className="bg-gray-50 border-2 border-[#132540] rounded-3xl w-full">
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-transparent rounded-3xl focus:outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search inventory..."
                        />
                    </div>
                </div>

                {/* Filter dropdowns */}
                <div className="flex flex-wrap gap-3 items-center">

                    {/* Category dropdown */}
                    <div className="relative">
                        <select
                            onChange={e => {
                                if (e.target.value) toggleFilter(e.target.value, selectedCategories, setSelectedCategories);
                                e.target.value = "";
                            }}
                            className="border-2 border-[#132540] rounded-2xl px-3 py-2 bg-white text-[#132540] text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="">Category {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}</option>
                            {categories.map(category => (
                                <option key={category} value={category}
                                    style={{ fontWeight: selectedCategories.includes(category) ? "bold" : "normal" }}>
                                    {selectedCategories.includes(category) ? "✓ " : ""}{category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status dropdown */}
                    <div className="relative">
                        <select
                            onChange={e => {
                                if (e.target.value) toggleFilter(e.target.value, selectedStatuses, setSelectedStatuses);
                                e.target.value = "";
                            }}
                            className="border-2 border-[#132540] rounded-2xl px-3 py-2 bg-white text-[#132540] text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="">Status {selectedStatuses.length > 0 ? `(${selectedStatuses.length})` : ""}</option>
                            {statuses.map(status => (
                                <option key={status} value={status}
                                    style={{ fontWeight: selectedStatuses.includes(status) ? "bold" : "normal" }}>
                                    {selectedStatuses.includes(status) ? "✓ " : ""}{status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Condition dropdown */}
                    <div className="relative">
                        <select
                            onChange={e => {
                                if (e.target.value) toggleFilter(e.target.value, selectedConditions, setSelectedConditions);
                                e.target.value = "";
                            }}
                            className="border-2 border-[#132540] rounded-2xl px-3 py-2 bg-white text-[#132540] text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="">Condition {selectedConditions.length > 0 ? `(${selectedConditions.length})` : ""}</option>
                            {conditions.map(condition => (
                                <option key={condition} value={condition}
                                    style={{ fontWeight: selectedConditions.includes(condition) ? "bold" : "normal" }}>
                                    {selectedConditions.includes(condition) ? "✓ " : ""}{condition}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results count */}
                    <span className="text-sm text-gray-500 ml-auto">
                        {itemMatches.length} of {items.length} items
                    </span>

                </div>

                {/* Active filter tags */}
                {allActiveTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        {allActiveTags.map(tag => (
                            <span
                                key={`${tag.type}-${tag.value}`}
                                className="flex items-center gap-1 bg-[#132540] text-white text-sm px-3 py-1 rounded-full"
                            >
                                <span className="text-xs text-gray-300 capitalize">{tag.type}:</span>
                                {tag.value}
                                <button
                                    onClick={() => removeTag(tag.value, tag.type)}
                                    className="ml-1 hover:text-red-300 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}

                        {/* Clear all button */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full px-3 py-1 text-sm transition-colors cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                )}

            </div>

            {/* Equipment grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white p-4 rounded-3xl">
                {items.length === 0 &&
                    <div className="flex flex-col gap-6 bg-orange-100 border p-6 border-gray-100 shadow-lg rounded-3xl col-span-4 m-10 justify-self-center">
                        <span className="text-orange-700 font-semibold underline text-xl text-center">No Items Found!</span>
                        <span className="text-orange-700 text-center text-xl tracking-wide">Use the "Add Item" tab to add equipment!</span>
                    </div>
                }

                {itemMatches.length === 0 && items.length > 0 &&
    <div className="flex flex-col gap-4 bg-orange-100 border p-6 border-gray-100 shadow-lg rounded-3xl col-span-4 m-10 justify-self-center">
        {selectedCategories.length > 0 && itemMatches.length === 0 ? (
            <>
                <span className="text-4xl text-center">🚴‍♂️</span>
                <span className="text-orange-700 font-semibold text-xl text-center">
                    These items are so cutting-edge, they haven't arrived yet!
                </span>
                <span className="text-orange-600 text-center">
                    Check back soon! good things come to those who wait. 
                </span>
            </>
        ) : (
            <>
                <span className="text-orange-700 font-semibold text-xl text-center">No items match your search!</span>
                <button onClick={clearFilters} className="text-orange-700 underline text-center cursor-pointer">
                    Clear filters
                </button>
            </>
        )}
    </div>
}
                {itemMatches.map((item) => (
                    <EquipmentCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}