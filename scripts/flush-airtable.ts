/**
 * Delete every record in the Submissions table.
 * Run with: npm run flush
 *
 * Use when you need to wipe between events or get out of a bad state.
 * Requires CONFIRM=yes to actually run.
 */
import { deleteRecords, fetchAllRecordIds } from "../src/lib/submissions";

async function main() {
  if (process.env.CONFIRM !== "yes") {
    console.error("Refusing to run without CONFIRM=yes");
    console.error("Usage: CONFIRM=yes npm run flush");
    process.exit(1);
  }

  const ids = await fetchAllRecordIds();
  if (ids.length === 0) {
    console.log("No records to delete.");
    return;
  }

  console.log(`Deleting ${ids.length} records...`);
  const deleted = await deleteRecords(ids);
  console.log(`Done. Deleted ${deleted} records.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
