import re

def validate_url(url: str) -> bool:
    if not url:
        return False
    # Regex that supports subdomains (e.g. about.meta.com, www.openai.com, etc.)
    domain_pattern = re.compile(
        r'^(?:https?://)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:/\S*)?$'
    )
    return bool(domain_pattern.match(url))
