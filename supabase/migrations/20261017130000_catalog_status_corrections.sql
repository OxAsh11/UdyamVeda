-- Lifecycle corrections from the 2026-10-17 catalog audit, approved by the
-- owner. Each record's own approved window evidence (and, for the three
-- 30-Sep-2026 dates, a fresh check) showed no open application route.
-- Only lifecycle status changes here; approved versions are untouched.

-- Paused: the programme exists, but no current call or intake is open.
update public.opportunities set status = 'paused' where slug in (
  'birac-ace-fund-biotech-fund-of-funds',                 -- no universal current intake; partner-dependent
  'birac-leap-fund-biotech-startup-equity',               -- no universal current intake; partner-dependent
  'birac-seed-fund-biotech-startup-equity',               -- no universal current intake; partner-dependent
  'chips-to-startup-c2s',                                 -- RSC call closed 22 Jul 2026; no current general call
  'great-technical-textiles-startup-grant',               -- no current GREAT window verified
  'birac-pace-academic-research-conversion-to-enterprise',-- no current AIR/CRS RFP
  'birac-eyuva-student-research-innovation',              -- official page: "NO ACTIVE CALLS"
  'birac-sitare-student-innovation',                      -- no current GYTI/BIIS call
  'idex-aditi-critical-technologies',                     -- only a historical 2024 timeline; no current challenge
  'drdo-technology-development-fund-startup-msme',        -- TDF portal: no projects available
  'revamped-pharmaceutical-technology-upgradation-assistance-scheme', -- 2026 intake unconfirmed
  'pm-rkvy-raftaar-navodaya-agripreneurship-orientation', -- current cohort closed
  'pm-rkvy-raftaar-samriddhi-startup-incubation',         -- current cohort closed
  'national-startup-awards',                              -- NSA 5.0 closed; next edition not announced
  'mofpi-integrated-cold-chain-value-addition-pmksy',     -- irradiation EOI closed 30 Sep 2026; no further extension found
  'mopng-cbg-biomass-aggregation-machinery'               -- BAM cut-off 30 Sep 2026 "unless extended"; no extension found
) and status = 'active';

-- Closed: no route for new applicants.
update public.opportunities set status = 'closed' where slug in (
  'iitf-2026-pms-domestic-trade-fair',                    -- applications closed 20 Sep 2026
  'production-linked-incentive-bulk-drugs-ksm-di-api',    -- time-bound application rounds; claims only for selected applicants
  'production-linked-incentive-medical-devices',          -- selection complete; claims only for approved participants
  'production-linked-incentive-telecom-networking-products' -- application window closed
) and status = 'active';
