
// src/lib/error-emitter.ts
import { EventEmitter } from 'events';

// It's important to use a single instance of the emitter throughout the application.
// This is achieved by exporting a singleton instance.
export const errorEmitter = new EventEmitter();
