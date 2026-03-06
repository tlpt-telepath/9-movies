const isPages = process.env.GITHUB_PAGES === 'true';
const repository = process.env.GITHUB_REPOSITORY ?? '';
const repoName = repository.split('/')[1] ?? '';
const isUserOrOrgSite = repoName.endsWith('.github.io');
const basePath = isPages && repoName && !isUserOrOrgSite ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
