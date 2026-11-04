// Local test-process preload only. Never imported by the application.
const NativeDate = Date;
const instant = NativeDate.parse('2026-11-12T03:30:00Z');
global.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [instant])); } static now(){return instant;} };
