export type Certificate = {
  title: string;
  issuer: string;
  /** When it was issued, e.g. "2023" or "Mar 2023". */
  year?: string;
  /** Picture of the certificate inside /public, e.g. "/certificates/google-it-support.jpg".
   *  Leave it out until you have one: the card shows "Picture coming soon". */
  src?: string;
  /** Describes the picture for screen readers. */
  alt: string;
  /** Public link where anyone can check it's real (Coursera, Credly, ...). Stronger proof than a picture. */
  verifyUrl?: string;
};

// How to add one:
// 1. Save the certificate as a .jpg/.png (export or screenshot the PDF), crop it, keep it under ~500 KB.
// 2. Put it in public/certificates/ with a lowercase-hyphen name, e.g. google-it-support.jpg.
// 3. Add or update an entry below. Newest first.
export const certificates: Certificate[] = [
  {
    title: "Google IT Support ",
    issuer: "Google · Coursera",
    year: "2025",
    src: "/certificates/googleIT-support-cert.jpg",
    alt: "Google IT Support Professional Certificate awarded to Muhammad Iqbal",
    verifyUrl: "https://coursera.org/verify/professional-cert/25G2WZ077OGQ",
  },
  {
    title: "Huawei Intern Certificate",
    issuer: "Huawei",
    year: "2025",
    src: "/certificates/huawei-certificate.jpg",
    alt: "Huawei Certificate of internship completion",
  },
  {
    title: "Research Presenter Certificate",
    issuer: "IEEE · SOFT",
    year: "2025",
    src: "/certificates/presenter-certificate.jpg",
    alt: "Certificate as a research presenter for my Paper",
    verifyUrl : "https://ieeexplore.ieee.org/document/11213456",
  },
  {
    title: "International Community Service Certificate",
    issuer: "Universiti Teknologi Mara",
    year: "2023",
    src: "/certificates/UITM-cert.jpg",
    alt: "Certificate of my participation in international Community Service",
  },
];