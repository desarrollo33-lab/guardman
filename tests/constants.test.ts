import { describe, it, expect } from 'vitest';
import {
  SITE, STATS, SERVICE_NAMES, SERVICE_SLUGS, LOCATIONS, LOCATION_SLUGS,
  ZONE_CONTEXT, SECTOR_NAMES, SECTOR_TO_SERVICE, API_TIMEOUT_MS, BUNDLE_VERSION,
} from '../src/lib/constants';

describe('constants', () => {
  it('SITE has required fields', () => {
    expect(SITE.NAME).toBe('GuardMan Chile');
    expect(SITE.URL).toMatch(/^https?:\/\//);
    expect(SITE.API_URL).toMatch(/^https?:\/\//);
    expect(SITE.PHONE).toMatch(/\+56/);
    expect(SITE.EMAIL_INFO).toMatch(/@/);
    expect(SITE.FOUNDED_YEAR).toBeGreaterThan(2010);
  });

  it('STATS has 4 numeric stats', () => {
    expect(Object.keys(STATS)).toEqual(['GUARDIAS', 'EMPRESAS', 'COMUNAS', 'ANOS']);
  });

  it('SERVICE_SLUGS matches SERVICE_NAMES keys', () => {
    expect(new Set(SERVICE_SLUGS)).toEqual(new Set(Object.keys(SERVICE_NAMES)));
    expect(SERVICE_SLUGS.length).toBeGreaterThanOrEqual(9);
  });

  it('LOCATION_SLUGS matches LOCATIONS slugs', () => {
    expect(new Set(LOCATION_SLUGS)).toEqual(new Set(LOCATIONS.map((l) => l.slug)));
    expect(LOCATIONS.length).toBeGreaterThanOrEqual(14);
  });

  it('every location has valid lat/lng', () => {
    for (const l of LOCATIONS) {
      expect(l.lat).toBeGreaterThan(-60);
      expect(l.lat).toBeLessThan(0);
      expect(l.lng).toBeGreaterThan(-80);
      expect(l.lng).toBeLessThan(-60);
    }
  });

  it('ZONE_CONTEXT covers every location slug', () => {
    for (const l of LOCATIONS) {
      expect(ZONE_CONTEXT[l.slug]).toBeTruthy();
    }
  });

  it('SECTOR_TO_SERVICE only references valid service slugs', () => {
    for (const v of Object.values(SECTOR_TO_SERVICE)) {
      expect(SERVICE_NAMES[v]).toBeTruthy();
    }
  });

  it('SECTOR_NAMES has expected set', () => {
    expect(SECTOR_NAMES.residencial).toBe('Residencial');
    expect(SECTOR_NAMES.comercial).toBe('Comercial');
  });

  it('API_TIMEOUT_MS is reasonable', () => {
    expect(API_TIMEOUT_MS).toBeGreaterThanOrEqual(5_000);
    expect(API_TIMEOUT_MS).toBeLessThanOrEqual(60_000);
  });

  it('BUNDLE_VERSION is set', () => {
    expect(BUNDLE_VERSION).toMatch(/^v\d/);
  });
});
