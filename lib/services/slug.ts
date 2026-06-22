/**
 * Generates the base slug from a member name according to specified rules:
 * - If name length <= 12, then slug is the name (replacing space with dash (-))
 * - Else, split name by space.
 *   - If first word length is between 3 and 12, then take as slug.
 *   - Else if less than 3, complete with prefix of words (joined by dash).
 *   - Else if more than 12, truncate to 12.
 * - Always returned in lowercase.
 */
export function generateSlug(name: string): string {
  const cleanName = name.trim().replace(/\s+/g, " ");

  if (cleanName.length <= 12) {
    return cleanName.toLowerCase().replace(/\s/g, "-");
  }

  const words = cleanName.split(" ");
  const firstWord = words[0];

  if (firstWord.length >= 3 && firstWord.length <= 12) {
    return firstWord.toLowerCase();
  } else if (firstWord.length > 12) {
    return firstWord.substring(0, 12).toLowerCase();
  } else {
    // firstWord.length < 3
    // complete with prefix of words
    let slug = firstWord;
    for (let i = 1; i < words.length; i++) {
      slug += "-" + words[i];
      if (slug.length >= 3) {
        break;
      }
    }
    if (slug.length > 12) {
      return slug.substring(0, 12).toLowerCase();
    }
    return slug.toLowerCase();
  }
}
