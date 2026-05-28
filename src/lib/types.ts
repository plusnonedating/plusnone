export interface Submission {
  id: string;
  firstName: string;
  age: number;
  gender: string;
  interestedIn?: string;
  lookingFor?: string;
  pitch?: string;
  videoUrl: string;
  /** ISO 8601 datetime of the most recent /[slug] visit by this submitter's device, or undefined if never recorded. */
  lastSeen?: string;
}
