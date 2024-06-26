import { MetadataRoute } from "next";

export default function robot(): MetadataRoute.Robots {
    return {
        rules: {
            // all the user agents from all Search engines
            userAgent: '*',
            allow: ["/"],
            disallow: []
        },
        sitemap: 'quizzly.lachsfilet.tech/sitemap.xml'
    }
}