import { HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private health;
    private db;
    private memory;
    private disk;
    constructor(health: HealthCheckService, db: TypeOrmHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & import("@nestjs/terminus").HealthIndicatorResult<"database">, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined>>;
    ready(): {
        status: string;
        timestamp: string;
    };
    live(): {
        status: string;
        timestamp: string;
    };
}
