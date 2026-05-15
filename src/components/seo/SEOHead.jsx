import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, canonical, robots, jsonld }) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="SafirMed" />
      <meta property="og:image" content="/icon.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content="/icon.jpg" />
      {jsonld && (
        <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
      )}
    </Helmet>
  );
}
