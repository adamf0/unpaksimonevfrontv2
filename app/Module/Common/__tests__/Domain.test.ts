import "./mocks/apiMocks";
import { describe, it, expect, vi } from "vitest";
import { DateTimeVO } from "../Domain/DateTimeVO";
import { FilterBuilder } from "../Domain/FilterBuilder";
import { DateRangeService } from "../DomainService/DateRangeService";

describe("DateTimeVO Value Object", () => {
  it("should handle null/empty inputs as invalid", () => {
    const vo1 = new DateTimeVO(null);
    const vo2 = DateTimeVO.create("");

    expect(vo1.isValid()).toBe(false);
    expect(vo2.isValid()).toBe(false);
    expect(vo1.toDateString()).toBe("-");
    expect(vo1.toDateTimeString()).toBe("-");
    expect(vo1.valueOf()).toBeNull();
  });

  it("should handle invalid dates gracefully", () => {
    const vo = new DateTimeVO("invalid-date-format");
    expect(vo.isValid()).toBe(false);
  });

  it("should parse valid ISO date strings and JS Dates", () => {
    const testDateStr = "2026-06-09T08:00:00.000Z";
    const vo = new DateTimeVO(testDateStr);

    expect(vo.isValid()).toBe(true);
    expect(vo.toISOString()).toBe(testDateStr);
    expect(vo.toDate()).toBeInstanceOf(Date);
    expect(vo.valueOf()).toBe(new Date(testDateStr).getTime());
  });

  it("should format dates according to Indonesian locale rules", () => {
    // 2026-06-09
    const vo = new DateTimeVO("2026-06-09T15:30:00.000Z");

    // locale testing might differ depending on environment settings, 
    // but we can check if it returns string containing "Juni" or long year
    expect(vo.toDateString()).toContain("Juni");
    expect(vo.toDateString()).toContain("2026");
    expect(vo.toDateTimeString()).toContain("Jun");
  });

  it("should determine whether a date is in the past or future relative to now", () => {
    const pastVo = new DateTimeVO(new Date(Date.now() - 3600000)); // 1 hour ago
    const futureVo = new DateTimeVO(new Date(Date.now() + 3600000)); // 1 hour future

    expect(pastVo.isPast()).toBe(true);
    expect(pastVo.isFuture()).toBe(false);

    expect(futureVo.isPast()).toBe(false);
    expect(futureVo.isFuture()).toBe(true);
  });

  it("should return false for past/future checks if value is invalid", () => {
    const invalidVo = new DateTimeVO(null);
    expect(invalidVo.isPast()).toBe(false);
    expect(invalidVo.isFuture()).toBe(false);
  });
});

describe("FilterBuilder Class", () => {
  it("should build simple eq rules from object query keys", () => {
    const builder = new FilterBuilder()
      .add("name", "nama_dosen", "eq")
      .add("nidn", "nidn_code", "eq");

    const query = { name: "Budi", nidn: "040101" };
    const result = builder.build(query);

    expect(result).toBe("nama_dosen:eq:Budi;nidn_code:eq:040101");
  });

  it("should skip empty/undefined query fields", () => {
    const builder = new FilterBuilder()
      .add("name", "nama", "eq")
      .add("email", "email_addr", "eq");

    const query = { name: "Budi", email: "" };
    const result = builder.build(query);

    expect(result).toBe("nama:eq:Budi");
  });

  it("should transform values before building serialization", () => {
    const builder = new FilterBuilder()
      .add("status", "status_aktif", "eq", (val) => val ? "1" : "0");

    const query = { status: true };
    const result = builder.build(query);

    expect(result).toBe("status_aktif:eq:1");
  });

  it("should count filled rules correctly, excluding skip flags", () => {
    const builder = new FilterBuilder()
      .add("name", "nama", "eq")
      .add("role", "role", "eq", undefined, true) // skip = true
      .add("active", "active", "eq");

    const query = { name: "John", role: "prodi", active: "yes" };
    
    expect(builder.countFilled(query)).toBe(2); // excluding role
  });
});

describe("DateRangeService Domain Service", () => {
  it("should return null if start or end are empty/invalid", () => {
    const start = new DateTimeVO(null);
    const end = new DateTimeVO("2026-06-09T10:00:00Z");
    const service = new DateRangeService(start, end, []);

    expect(service.getStatus(new DateTimeVO(Date.now()))).toBeNull();
  });

  it("should return TIME_RANGE_INVALID if end date is before start date", () => {
    const start = new DateTimeVO("2026-06-09T12:00:00Z");
    const end = new DateTimeVO("2026-06-09T10:00:00Z");
    const service = new DateRangeService(start, end, []);

    expect(service.getStatus(new DateTimeVO("2026-06-09T11:00:00Z"))).toBe("TIME_RANGE_INVALID");
  });

  it("should return SCHEDULED if now is before start", () => {
    const start = new DateTimeVO("2026-06-09T10:00:00Z");
    const end = new DateTimeVO("2026-06-09T12:00:00Z");
    const service = new DateRangeService(start, end, []);

    const now = new DateTimeVO("2026-06-09T09:59:59Z");
    expect(service.getStatus(now)).toBe("SCHEDULED");
  });

  it("should return ACTIVE if now is between start and end", () => {
    const start = new DateTimeVO("2026-06-09T10:00:00Z");
    const end = new DateTimeVO("2026-06-09T12:00:00Z");
    const service = new DateRangeService(start, end, []);

    const now = new DateTimeVO("2026-06-09T11:00:00Z");
    expect(service.getStatus(now)).toBe("ACTIVE");
  });

  it("should return ACTIVE if expired but has extension list overrides", () => {
    const start = new DateTimeVO("2026-06-09T10:00:00Z");
    const end = new DateTimeVO("2026-06-09T12:00:00Z");
    // listext contains items
    const service = new DateRangeService(start, end, [{ ext: true }]);

    const now = new DateTimeVO("2026-06-09T13:00:00Z");
    expect(service.getStatus(now)).toBe("ACTIVE");
  });

  it("should return EXPIRED if now is past end and extension list is empty", () => {
    const start = new DateTimeVO("2026-06-09T10:00:00Z");
    const end = new DateTimeVO("2026-06-09T12:00:00Z");
    const service = new DateRangeService(start, end, []);

    const now = new DateTimeVO("2026-06-09T12:00:01Z");
    expect(service.getStatus(now)).toBe("EXPIRED");
  });
});
