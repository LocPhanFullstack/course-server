"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOverallProgress = exports.mergeChapters = exports.mergeSections = void 0;
const mergeSections = (existingSections, newSections) => {
    const existingSectionsMap = new Map();
    for (const existingSection of existingSections) {
        existingSectionsMap.set(existingSection.sectionId, existingSection);
    }
    for (const newSection of newSections) {
        const section = existingSectionsMap.get(newSection.sectionId);
        if (!section) {
            // Add new section
            existingSectionsMap.set(newSection.sectionId, newSection);
        }
        else {
            // Merge chapters within the existing section
            section.chapters = (0, exports.mergeChapters)(section.chapters, newSection.chapters);
            existingSectionsMap.set(newSection.sectionId, section);
        }
    }
    return Array.from(existingSectionsMap.values());
};
exports.mergeSections = mergeSections;
const mergeChapters = (existingChapters, newChapters) => {
    const existingChaptersMap = new Map();
    for (const existingChapter of existingChapters) {
        existingChaptersMap.set(existingChapter.chapterId, existingChapter);
    }
    for (const newChapter of newChapters) {
        existingChaptersMap.set(newChapter.chapterId, Object.assign(Object.assign({}, (existingChaptersMap.get(newChapter.chapterId) || {})), newChapter));
    }
    return Array.from(existingChaptersMap.values());
};
exports.mergeChapters = mergeChapters;
const calculateOverallProgress = (sections) => {
    const totalChapters = sections.reduce((acc, section) => acc + section.chapters.length, 0);
    const completeChapters = sections.reduce((acc, section) => acc + section.chapters.filter((chapter) => chapter.completed).length, 0);
    return totalChapters > 0 ? (completeChapters / totalChapters) * 100 : 0;
};
exports.calculateOverallProgress = calculateOverallProgress;
