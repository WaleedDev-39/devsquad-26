import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');
import { MONGO_DB } from '../database/database.module';

const CSV_DIR = path.join(__dirname, '..', '..');

const FORMAT_MAP: Record<string, string> = {
  test: 'test', tests: 'test',
  odi: 'odi', odis: 'odi', 'list a': 'odi',
  t20i: 't20', t20is: 't20', t20: 't20', twenty20: 't20',
};

function safeNum(v: any): number | null {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function safeInt(v: any): number | null {
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

@Injectable()
export class SeedService {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  // ── Load player lookup from player_info.csv ─────────────────────────────
  private loadPlayerInfo(): Promise<Map<string, { player_name: string; short_name: string; country: string }>> {
    return new Promise((resolve, reject) => {
      const map = new Map<string, any>();
      const filePath = path.join(CSV_DIR, 'player_info.csv');

      if (!fs.existsSync(filePath)) {
        console.warn('player_info.csv not found, player names will be unknown');
        resolve(map);
        return;
      }

      fs.createReadStream(filePath)
        .pipe(
          csv({
            headers: ['player_id', 'short_name', 'full_name', 'role', 'dob', 'batting_style', 'country', 'c8', 'c9', 'c10', 'c11'],
            skipLines: 0,
          }),
        )
        .on('data', (row) => {
          const pid = String(row.player_id || '').trim();
          if (pid) {
            map.set(pid, {
              player_name: (row.full_name || row.short_name || 'Unknown').trim(),
              short_name: (row.short_name || '').trim(),
              country: (row.country || 'Unknown').trim(),
            });
          }
        })
        .on('end', () => resolve(map))
        .on('error', reject);
    });
  }

  // ── Main seed function ──────────────────────────────────────────────────
  async seed(): Promise<string> {
    console.log('🌱 Starting database seed...');

    // Load player info
    const playerInfo = await this.loadPlayerInfo();
    console.log(`📋 Loaded ${playerInfo.size} player records`);

    // Drop existing collections
    for (const col of ['test', 'odi', 't20']) {
      await this.db.collection(col).drop().catch(() => {});
      console.log(`🗑  Dropped collection: ${col}`);
    }

    const matchFile = path.join(CSV_DIR, 'cric_players_match_by_match.csv');
    if (!fs.existsSync(matchFile)) {
      throw new Error(`CSV not found: ${matchFile}`);
    }

    const buffers: Record<string, any[]> = { test: [], odi: [], t20: [] };
    let totalProcessed = 0;
    let totalInserted = 0;

    const MATCH_HEADERS = [
      'player_id', 'match_date', 'format', 'team', 'venue', 'result',
      'innings', 'dismissal', 'runs_raw', 'bat_pos', 'runs', 'balls_faced',
      'fours', 'sixes', 'strike_rate', 'not_out', 'overs_bowled', 'maidens',
      'runs_conceded', 'wickets', 'economy', 'best_bowling', 'catches',
      'match_ref', 'year', 'fifty', 'hundred', 'duck', 'five_wicket',
      'ten_wicket', 'opponent', 'caught_out', 'stumped_out',
    ];

    const flushBuffer = async (colName: string) => {
      if (buffers[colName].length > 0) {
        await this.db.collection(colName).insertMany(buffers[colName], { ordered: false }).catch(() => {});
        totalInserted += buffers[colName].length;
        buffers[colName] = [];
      }
    };

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(matchFile)
        .pipe(csv({ headers: MATCH_HEADERS, skipLines: 0 }))
        .on('data', async (row) => {
          const fmtRaw = (row.format || '').trim().toLowerCase();
          const colName = FORMAT_MAP[fmtRaw];
          if (!colName) return;

          totalProcessed++;
          const pid = String(row.player_id || '').trim();
          const pinfo = playerInfo.get(pid) || { player_name: 'Unknown', short_name: '', country: 'Unknown' };

          const doc = {
            player_id:     safeInt(pid),
            player_name:   pinfo.player_name,
            short_name:    pinfo.short_name,
            country:       pinfo.country,
            match_date:    (row.match_date || '').trim(),
            team:          (row.team || '').trim(),
            opponent:      (row.opponent || '').trim(),
            venue:         (row.venue || '').trim(),
            result:        (row.result || '').trim(),
            innings:       safeInt(row.innings),
            dismissal:     (row.dismissal || '').trim(),
            runs:          safeInt(row.runs) ?? 0,
            balls_faced:   safeInt(row.balls_faced),
            fours:         safeInt(row.fours),
            sixes:         safeInt(row.sixes),
            strike_rate:   safeNum(row.strike_rate),
            not_out:       safeInt(row.not_out),
            overs_bowled:  safeNum(row.overs_bowled),
            maidens:       safeInt(row.maidens),
            runs_conceded: safeInt(row.runs_conceded),
            wickets:       safeInt(row.wickets),
            economy:       safeNum(row.economy),
            best_bowling:  (row.best_bowling || '').trim(),
            year:          safeInt(row.year),
            fifty:         safeInt(row.fifty),
            hundred:       safeInt(row.hundred),
            duck:          safeInt(row.duck),
            five_wicket:   safeInt(row.five_wicket),
            match_ref:     (row.match_ref || '').trim(),
          };

          buffers[colName].push(doc);

          // Flush every 5000 docs
          if (buffers[colName].length >= 5000) {
            await flushBuffer(colName);
            console.log(`  ✅ Flushed 5000 to '${colName}' (total processed: ${totalProcessed})`);
          }
        })
        .on('end', async () => {
          for (const col of ['test', 'odi', 't20']) await flushBuffer(col);
          resolve();
        })
        .on('error', reject);
    });

    // Create indexes
    for (const col of ['test', 'odi', 't20']) {
      await this.db.collection(col).createIndex({ player_name: 1 });
      await this.db.collection(col).createIndex({ runs: -1 });
      await this.db.collection(col).createIndex({ wickets: -1 });
      await this.db.collection(col).createIndex({ country: 1 });
    }

    const counts: Record<string, number> = {};
    for (const col of ['test', 'odi', 't20']) {
      counts[col] = await this.db.collection(col).countDocuments();
    }

    const summary = `Seeding complete! test: ${counts.test}, odi: ${counts.odi}, t20: ${counts.t20} documents.`;
    console.log(`🎉 ${summary}`);
    return summary;
  }
}
