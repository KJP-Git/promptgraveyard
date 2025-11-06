/**
 * 🛠️ API Helper Utilities 🛠️
 * Spooky utilities for consistent API responses and error handling
 */

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiResponse } from '@/types/graveyard';

/**
 * 📦 Create standardized API response
 */
export function createApiResponse<T>(
  data: T | null, 
  message: string = '', 
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : message,
    message: success ? message : undefined,
    timestamp: new Date().toISOString(),
    request_id: uuidv4()
  };
}

/**
 * 💀 Handle controller errors with spooky flair
 */
export function handleControllerError(
  res: Response, 
  error: any, 
  defaultMessage: string = 'An unexpected error occurred in the digital realm'
): void {
  console.error('🚨 Controller Error:', error);

  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || defaultMessage;

  const response: ApiResponse = createApiResponse(
    null,
    `💀 ${message}`,
    false
  );

  res.status(statusCode).json(response);
}

/**
 * ✅ Validate request data using Joi schema
 */
export function validateRequest(data: any, schema: Joi.ObjectSchema): {
  isValid: boolean;
  error?: string;
  value?: any;
} {
  const { error, value } = schema.validate(data, { 
    abortEarly: false,
    stripUnknown: true 
  });

  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join('; ');
    
    return {
      isValid: false,
      error: errorMessage
    };
  }

  return {
    isValid: true,
    value
  };
}

/**
 * 🎭 Add spooky flair to error messages
 */
export function spookifyError(message: string): string {
  const spookyPrefixes = [
    '👻 Boo!',
    '💀 Uh oh!',
    '🧟‍♂️ Groan...',
    '🎃 Eek!',
    '⚡ Zap!',
    '🔮 The spirits say...',
    '🧙‍♀️ The magic failed...'
  ];

  const randomPrefix = spookyPrefixes[Math.floor(Math.random() * spookyPrefixes.length)];
  return `${randomPrefix} ${message}`;
}

/**
 * 📊 Parse numeric query parameters safely
 */
export function parseNumericQuery(value: any, defaultValue: number, min?: number, max?: number): number {
  const parsed = parseInt(value);
  
  if (isNaN(parsed)) {
    return defaultValue;
  }

  let result = parsed;
  
  if (min !== undefined && result < min) {
    result = min;
  }
  
  if (max !== undefined && result > max) {
    result = max;
  }

  return result;
}

/**
 * 🔍 Parse boolean query parameters
 */
export function parseBooleanQuery(value: any): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return true;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return false;
    }
  }
  
  return undefined;
}

/**
 * 🕒 Format timestamp for spooky display
 */
export function formatSpookyTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '👻 Just now, from beyond the veil...';
  } else if (diffMinutes < 60) {
    return `🕐 ${diffMinutes} minutes ago, in the witching hour...`;
  } else if (diffHours < 24) {
    return `🌙 ${diffHours} hours ago, under the moonlight...`;
  } else if (diffDays < 7) {
    return `📅 ${diffDays} days ago, in the haunted past...`;
  } else {
    return `⚰️ Long ago, in the ancient digital archives... (${date.toLocaleDateString()})`;
  }
}

/**
 * 🎨 Generate spooky response messages based on data
 */
export function generateSpookyMessage(type: string, count?: number, context?: string): string {
  const messages = {
    prompts_found: [
      `🎃 Discovered ${count} prompts lurking in the graveyard`,
      `👻 Summoned ${count} prompts from the digital realm`,
      `🔮 The crystal ball reveals ${count} prompts`,
      `📜 Ancient scrolls contain ${count} prompts`
    ],
    zombies_found: [
      `🧟‍♂️ Found ${count} zombie prompts shambling about`,
      `💀 Detected ${count} undead prompts in need of revival`,
      `⚰️ ${count} prompts have joined the zombie horde`,
      `🩸 ${count} prompts have succumbed to the curse`
    ],
    revival_success: [
      '🎉 The revival ritual was successful! The prompt lives again!',
      '✨ Necromancy complete! The zombie has been brought back to life!',
      '🌟 The dark magic worked! Your prompt is now among the living!',
      '⚡ Lightning struck! The prompt has been resurrected!'
    ],
    revival_failed: [
      '💀 The revival ritual failed. The zombie resisted our magic.',
      '⚡ The necromancy backfired! Try a different approach.',
      '🌩️ The spirits were not pleased. Revival unsuccessful.',
      '🔮 The crystal ball cracked. The prompt remains undead.'
    ]
  };

  const messageArray = messages[type as keyof typeof messages];
  if (!messageArray) {
    return context || 'Something spooky happened...';
  }

  return messageArray[Math.floor(Math.random() * messageArray.length)];
}