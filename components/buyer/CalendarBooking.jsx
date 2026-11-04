'use client';
import {recordEvent} from '@/lib/measurement';
import {bookingUrl} from '@/lib/buyer/booking.mjs';
export default function CalendarBooking(){const url=bookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL);if(!url)return null;return <div className="notice"><h3>Choose an available meeting time</h3><p>Use the team’s Google booking page to see availability and complete a booking. Your project brief stays here and is not added to that link.</p><a className="btn btn-ghost" href={url} target="_blank" rel="noopener noreferrer" onClick={()=>recordEvent("calendar_booking_opened")}>Open Google booking page</a><p className="small">Google confirms the appointment after you complete its booking flow. An enquiry or preferred slot submitted here does not reserve a time.</p></div>}
