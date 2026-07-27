import { Helmet } from "react-helmet-async"

type PageMetaProps = {
    title: string;
    description: string;
    image?: string;
    canonicalPath?: string;
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
    indexable?: boolean;
};

const PageMeta = ({
    title,
    description,
    image = "/chatavt.png",
    canonicalPath,
    structuredData,
    indexable = true,
}: PageMetaProps) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pathname = canonicalPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const canonicalUrl = origin ? new URL(pathname, origin).toString() : pathname;
    const socialImage = origin ? new URL(image, origin).toString() : image;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta
                name="robots"
                content={indexable
                    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
                    : "noindex,nofollow"}
            />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Bếp Việt" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={socialImage} />
            <meta property="og:image:alt" content="Bếp Việt - Ẩm thực Việt Nam" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={socialImage} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default PageMeta
