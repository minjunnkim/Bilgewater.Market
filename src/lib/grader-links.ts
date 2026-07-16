/**
 * Official grader deep-links.
 *
 * PSA cert: https://www.psacard.com/cert/{certNumber}
 *   — Universal for any valid PSA cert number.
 *
 * PSA population / spec: https://www.psacard.com/spec/psa/{specId}
 *   — SpecID from the PSA cert/spec page URL. Enter manually in Studio.
 *
 * BGS: No public cert deep-link API. Their lookup UI is
 *   https://www.beckett.com/grading/card-lookup
 *   (user must enter the cert). Population has no stable public deep-link.
 */

export function certLookupUrl(
  company?: string,
  certNumber?: string,
): string | null {
  if (!company || !certNumber) return null;
  const cert = certNumber.trim();
  if (!cert) return null;

  switch (company.toUpperCase()) {
    case "PSA":
      return `https://www.psacard.com/cert/${encodeURIComponent(cert)}`;
    case "BGS":
      // Beckett has no reliable cert deep-link; open the official lookup tool.
      return "https://www.beckett.com/grading/card-lookup";
    case "CGC":
      return `https://www.cgccards.com/certlookup/${encodeURIComponent(cert)}/`;
    case "SGC":
      return `https://gosgc.com/cert-code-lookup/?cert=${encodeURIComponent(cert)}`;
    default:
      return null;
  }
}

export function psaPopulationUrl(specId?: number | null): string | null {
  if (specId == null || !Number.isFinite(specId) || specId <= 0) return null;
  return `https://www.psacard.com/spec/psa/${specId}`;
}
