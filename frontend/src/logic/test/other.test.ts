import {
  calculateTotalPages,
  formatDate,
  formatDateTime,
  formatTime,
} from "../other";

describe("formatDate", () => {
  it("formats a date", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatDate(date)).toEqual("2020-01-01");
  });
  it("formats a date with a single digit month", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatDate(date)).toEqual("2020-01-01");
  });
  it("formats a date with a single digit day", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatDate(date)).toEqual("2020-01-01");
  });
});

describe("formatTime", () => {
  it("formats a time", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatTime(date)).toEqual("00:00");
  });
  it("formats a time with a single digit hour", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatTime(date)).toEqual("00:00");
  });
  it("formats a time with a single digit minute", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatTime(date)).toEqual("00:00");
  });
});

describe("formatDateTime", () => {
  it("formats a date and time", () => {
    const date = new Date("2020-01-01T00:00:00");
    expect(formatDateTime(date)).toEqual("2020-01-01 00:00");
  });
});

describe("calculateTotalPages", () => {
  it("calculates the total number of pages", () => {
    expect(calculateTotalPages(100, 10)).toEqual(10);
  });
  it("calculates the total number of pages with a remainder", () => {
    expect(calculateTotalPages(101, 10)).toEqual(11);
  });
});
