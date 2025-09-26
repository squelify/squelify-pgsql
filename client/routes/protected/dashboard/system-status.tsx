import { useQuery } from '@tanstack/react-query'
import * as Lucide from 'lucide-react'
import { Badge } from '#/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardDivider,
  CardHeader,
  CardTitle,
} from '#/components/card'
import { ProgressBar } from '#/components/progress-bar'
import { Text } from '#/components/text'
import { orpc } from '#/utils/orpc'

export default function SystemStatus() {
  const { data, isLoading, error } = useQuery(orpc.sysinfo.queryOptions())

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="w-full">
        <CardHeader spacing="compact">
          <CardTitle>System Status</CardTitle>
          <CardDescription>Health overview</CardDescription>
        </CardHeader>
        <CardDivider spacing="compact" />
        <CardContent spacing="compact" className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          ) : error ? (
            <Text className="text-red-500">Error loading health data</Text>
          ) : (
            <>
              <div className="mt-2 mb-4">
                {data?.status === 'healthy' ? (
                  <Lucide.CheckCircle className="size-12 text-green-500" strokeWidth={1.5} />
                ) : (
                  <Lucide.XCircle className="size-12 text-red-500" strokeWidth={1.5} />
                )}
              </div>
              <Badge variant={data?.status === 'healthy' ? 'success' : 'error'}>
                {data?.status || 'Unknown'}
              </Badge>
              <Text className="mt-4 text-muted-foreground text-sm">
                {data?.database?.connected ? 'All systems operational' : 'System issues detected'}
              </Text>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader spacing="compact">
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>Current server load</CardDescription>
        </CardHeader>
        <CardDivider spacing="compact" />
        <CardContent spacing="compact" className="py-6">
          {isLoading ? (
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          ) : error ? (
            <Text className="text-red-500">Error loading resource data</Text>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Text className="flex items-center font-medium text-sm">
                    <Lucide.Cpu className="mr-1 size-4" strokeWidth={2} />
                    Memory (Heap)
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {data?.memory.heapUsed || 'N/A'}
                  </Text>
                </div>
                <div className="flex items-center justify-between space-x-3">
                  <ProgressBar
                    size="sm"
                    variant="success"
                    value={Math.min(
                      (Number.parseInt(data?.memory.heapUsed || '0', 10) /
                        Number.parseInt(data?.memory.heapTotal || '1', 10)) *
                        100,
                      100
                    )}
                    className="w-full"
                  />
                  <span className="whitespace-nowrap font-semibold text-foreground text-xs">
                    {Math.round(
                      Math.min(
                        (Number.parseInt(data?.memory.heapUsed || '0', 10) /
                          Number.parseInt(data?.memory.heapTotal || '1', 10)) *
                          100,
                        100
                      )
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Text className="flex items-center font-medium text-sm">
                    <Lucide.HardDrive className="mr-1 size-4" strokeWidth={2} />
                    External Memory
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {data?.memory.external || 'N/A'}
                  </Text>
                </div>
                <div className="flex items-center justify-between space-x-3">
                  <ProgressBar size="sm" variant="neutral" value={45} className="w-full" />
                  {/* TODO: replace with dynamic value */}
                  <span className="whitespace-nowrap font-semibold text-foreground text-xs">
                    45%
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Text className="flex items-center font-medium text-sm">
                    <Lucide.Server className="mr-1 size-4" strokeWidth={2} />
                    RSS
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {data?.memory.residentSetSize || 'N/A'}
                  </Text>
                </div>
                <div className="flex items-center justify-between space-x-3">
                  <ProgressBar size="sm" variant="warning" value={65} className="w-full" />
                  {/* TODO: replace with dynamic value */}
                  <span className="whitespace-nowrap font-semibold text-foreground text-xs">
                    65%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader spacing="compact">
          <CardTitle>Environment</CardTitle>
          <CardDescription>Server configuration</CardDescription>
        </CardHeader>
        <CardDivider spacing="compact" />
        <CardContent spacing="compact" className="py-6">
          {isLoading ? (
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          ) : error ? (
            <Text className="text-red-500">Error loading environment data</Text>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lucide.Settings className="mr-2 size-4 text-muted-foreground" strokeWidth={2} />
                  <Text className="text-sm">Mode</Text>
                </div>
                <Badge variant="neutral">{data?.environment.mode || 'N/A'}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lucide.FileText className="mr-2 size-4 text-muted-foreground" strokeWidth={2} />
                  <Text className="text-sm">Log Level</Text>
                </div>
                <Badge variant="neutral">{data?.environment.logLevel || 'N/A'}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lucide.Database className="mr-2 size-4 text-muted-foreground" strokeWidth={2} />
                  <Text className="text-sm">Database</Text>
                </div>
                <Badge variant={data?.database?.connected ? 'success' : 'error'}>
                  {data?.database?.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lucide.Clock className="mr-2 size-4 text-muted-foreground" strokeWidth={2} />
                  <Text className="text-sm">Uptime</Text>
                </div>
                <Text className="font-medium text-sm">{data?.uptime || 'N/A'}</Text>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
