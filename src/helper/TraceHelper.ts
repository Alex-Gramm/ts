import * as Sentry from '@sentry/node';

class TraceHelper {
  static wrap<T> (name: string, fn: () => T): T {
    let span: any = null;
    // @ts-ignore
    const transaction = Sentry.getCurrentHub()
      .getScope()
      .getTransaction();
    if (transaction) {
      span = transaction.startChild({
        op: name
      });
    }
    const result = fn();
    if (transaction) {
      span?.finish();
    }
    return result;
  }
}

export default TraceHelper;
