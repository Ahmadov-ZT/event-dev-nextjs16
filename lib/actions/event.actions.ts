"use server";

import { Event, IEvent } from "@/database";
import dbConnect from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await dbConnect();
    // Normalize incoming slug to match DB slug generation behavior
    const normalizedSlug = String(slug)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const event = await Event.findOne({ slug: normalizedSlug }).lean<any | null>();
    if (!event) return [];

    // Normalize tags to an array in case they were stored as a comma-separated string
    let tags: string[] = [];
    if (Array.isArray(event.tags)) tags = event.tags;
    else if (typeof event.tags === 'string') {
      tags = event.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    if (tags.length === 0) return [];

    return await Event.find({ _id: { $ne: event._id }, tags: { $in: tags } })
      .limit(6)
      .lean<IEvent[]>();
  } catch (e) {
    console.error("getSimilarEventsBySlug error", e);
    return [];
  }
};
