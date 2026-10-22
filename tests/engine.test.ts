import test from "node:test";
import assert from "node:assert/strict";
import {
  SCIENCE_LABS_COURSES,
  HISTORY_SIGNATURE_COURSES,
  MATH_CURRICULUMS,
  MATH_CURRICULUM_MAP,
  buildCourseBlocks,
  findCourseByCategoryAndSlug,
} from "../src/lib/gauth-data/courses-catalog";
import {
  ATLAS_VIDEO_STORIES,
  ATLAS_INTERACTIVE_SESSIONS,
  ATLAS_VOICEOVER_LANGUAGES,
  ATLAS_FAQ_ITEMS,
  FEATURED_WORLD_MAP_POIS,
  findAtlasSessionById,
} from "../src/lib/gauth-data/atlas-catalog";
import {
  solveHomeworkQuestion,
  GAUTH_NEWS_ITEMS,
  GAUTH_BLOG_ARTICLES,
} from "../src/lib/gauth-data/solver-engine";

test("Gauth Homework Solver produces exact step-by-step quadratic derivation", () => {
  const solved = solveHomeworkQuestion(
    "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step",
    "Math",
    true
  );
  assert.equal(solved.answerSummary, "x = 2, x = 3");
  assert.equal(solved.steps.length, 4);
  assert.equal(solved.keyConcepts.methods.length, 3);
  assert.equal(solved.isProVerified, true);
  assert.ok(solved.proVerificationNote?.includes("Discriminant"));
});

test("Gauth Academy Catalog includes all Science Labs, History Signature, and Math Curriculums", () => {
  assert.equal(SCIENCE_LABS_COURSES.length, 12);
  assert.equal(HISTORY_SIGNATURE_COURSES.length, 8);
  assert.equal(MATH_CURRICULUMS.length, 3);

  const alg1 = MATH_CURRICULUM_MAP["algebra-1"];
  const alg2 = MATH_CURRICULUM_MAP["algebra-2"];
  const geom = MATH_CURRICULUM_MAP["geometry"];

  assert.equal(alg1.unitCount, 20);
  assert.equal(alg1.lessonCount, 77);
  assert.equal(alg2.unitCount, 20);
  assert.equal(alg2.lessonCount, 67);
  assert.equal(geom.unitCount, 21);
  assert.equal(geom.lessonCount, 61);

  const blocks = buildCourseBlocks("Fourier Transform Intuition", "my");
  assert.equal(blocks.length, 6);
  assert.equal(blocks[0].index, 1);

  const resolvedCourse = findCourseByCategoryAndSlug("science", "how-things-work-1");
  assert.equal(resolvedCourse.title, "The Sweet Spot");
  assert.equal(resolvedCourse.blocks.length, 6);
});

test("Gauth Atlas Catalog includes 6 Video Stories, 13 Interactive Sessions, 16+ Languages, and 106 World Map POIs", () => {
  assert.equal(ATLAS_VIDEO_STORIES.length, 6);
  assert.equal(ATLAS_INTERACTIVE_SESSIONS.length, 13);
  assert.ok(ATLAS_VOICEOVER_LANGUAGES.length >= 16);
  assert.equal(ATLAS_FAQ_ITEMS.length, 6);
  assert.equal(FEATURED_WORLD_MAP_POIS.length, 106);

  const silkRoads = findAtlasSessionById("2008824210280452");
  assert.equal(silkRoads.title, "Empires of the Silk Roads");
  assert.equal(silkRoads.chapters.length, 4);
  assert.equal(silkRoads.chapters[0].title, "The Crucible's Breath");
});

test("Gauth Resources include News items and Blog study guides", () => {
  assert.ok(GAUTH_NEWS_ITEMS.length >= 4);
  assert.equal(GAUTH_BLOG_ARTICLES.length, 10);
});
