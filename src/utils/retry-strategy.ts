import { Observable, ObservableInput, RetryConfig, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Logger } from '@/core/logger';
import { Milliseconds } from '@/types';

const logger = new Logger('RetryStrategy');

type RetryStrategyParams = Readonly<{
  eagerAttempts?: number;
  eagerDelay?: Milliseconds;
  lazyDelay?: Milliseconds;
  label?: string;
  stop$?: Observable<unknown>;
}>;

export const RetryStrategy = (params: RetryStrategyParams = {}): RetryConfig => ({
  delay: (_, attempt): ObservableInput<unknown> => {
    const { eagerAttempts = 3, eagerDelay = 1000, lazyDelay = 5000, label = 'Network failure', stop$ } = params;

    const delay = attempt <= eagerAttempts ? eagerDelay : lazyDelay;
    const retry$ = timer(delay);

    logger.warn(`${label}. Retrying in ${delay}ms. Attempt #${attempt}`);
    logger.debug(params, _);

    return stop$ ? retry$.pipe(takeUntil(stop$)) : retry$;
  },
});
