import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const port = 9645;

const exporter = new PrometheusExporter({ port }, () => {
  console.log(`[metrics] Server started on port ${port}`);
});

const meterProvider = new MeterProvider();

const meter = meterProvider.getMeter('example', 'local');

meterProvider.addMetricReader(exporter);

// metrics
const requestCount = meter.createCounter('http_request_count', {
  description: 'Incoming HTTP request count',
});

Bun.serve({
  port: 8080,
  fetch() {
    // metrics
    requestCount.add(1);

    // response
    const headers = new Headers();

    headers.append('content-type', 'text/html');

    return new Response('<h1>Bun example</h1>', { status: 200, headers });
  },
});

console.log('Server started on port 8080');
