"""
LegalMind AI - DeepSeek LLM Client
Executes grounded legal reasoning via the DeepSeek OpenAI-compatible API.
Includes robust timeout, missing key, and error handling.
"""

from typing import List, Dict, Any, Optional
import httpx
from backend.config import settings

class DeepSeekClient:
    """
    Client for DeepSeek chat completion API with timeout and error handling.
    """

    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_BASE_URL.rstrip("/")
        self.model = settings.DEEPSEEK_MODEL
        self.timeout = settings.LLM_TIMEOUT_SECONDS
        self.temperature = settings.LLM_TEMPERATURE
        self.max_tokens = settings.LLM_MAX_TOKENS

    def is_configured(self) -> bool:
        """Returns True if a non-placeholder API key is set."""
        return bool(self.api_key and not self.api_key.startswith("your_deepseek"))

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Sends messages payload to DeepSeek API.

        Returns:
            Dict containing:
            - "content": Generated response text
            - "model": Model name used
            - "is_mock_fallback": True if generated locally due to missing key
            - "usage": Token usage stats
        """
        if not self.is_configured():
            return {
                "content": None,
                "model": "deepseek-not-configured",
                "is_configured": False,
                "error": (
                    "DeepSeek API key is not configured. Please set DEEPSEEK_API_KEY in backend/.env "
                    "to enable live model generation."
                )
            }

        endpoint = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature if temperature is not None else self.temperature,
            "max_tokens": max_tokens if max_tokens is not None else self.max_tokens,
            "stream": False
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, headers=headers, json=payload)

            if response.status_code == 200:
                data = response.json()
                choice = data["choices"][0]["message"]
                return {
                    "content": choice["content"],
                    "model": data.get("model", self.model),
                    "is_configured": True,
                    "usage": data.get("usage", {})
                }
            elif response.status_code == 401:
                return {
                    "content": None,
                    "model": self.model,
                    "is_configured": True,
                    "error": "DeepSeek API authentication failed: Invalid or expired DEEPSEEK_API_KEY."
                }
            elif response.status_code == 429:
                return {
                    "content": None,
                    "model": self.model,
                    "is_configured": True,
                    "error": "DeepSeek API rate limit exceeded or quota exhausted."
                }
            else:
                return {
                    "content": None,
                    "model": self.model,
                    "is_configured": True,
                    "error": f"DeepSeek API returned error status {response.status_code}: {response.text}"
                }

        except httpx.TimeoutException:
            return {
                "content": None,
                "model": self.model,
                "is_configured": True,
                "error": f"DeepSeek API request timed out after {self.timeout} seconds."
            }
        except Exception as e:
            return {
                "content": None,
                "model": self.model,
                "is_configured": True,
                "error": f"Failed to communicate with DeepSeek API: {str(e)}"
            }

def get_llm_client() -> DeepSeekClient:
    return DeepSeekClient()
