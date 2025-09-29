#!/usr/bin/env python3
"""
Context Extractor Component for Langflow
Extracts context prompts from AI-generated board game recommendation outputs
"""

import re
from typing import Optional, Dict, Any
from langflow.base.io.text import TextComponent
from langflow.io import StrInput, Output, MultilineInput
from langflow.schema.message import Message
from langflow.schema.data import Data


class ContextExtractorComponent(TextComponent):
    display_name = "Context Extractor"
    description = "Extracts context prompts from AI-generated board game recommendation outputs for database queries"
    documentation = "https://docs.langflow.org/components-io#text-output"
    icon = "Search"
    name = "ContextExtractor"

    inputs = [
        MultilineInput(
            name="input_text",
            display_name="AI Output Text",
            info="The AI-generated text containing board game recommendations and context prompts",
            required=True,
        ),
        StrInput(
            name="context_marker",
            display_name="Context Marker",
            info="The text marker that indicates the start of the context prompt (default: 'Context Prompt:')",
            value="Context Prompt:",
            advanced=True,
        ),
        StrInput(
            name="fallback_query",
            display_name="Fallback Query",
            info="Default query to use if no context prompt is found",
            value="Find board games similar to the mentioned game with similar gameplay mechanics and themes",
            advanced=True,
        ),
    ]
    
    outputs = [
        Output(display_name="Extracted Context", name="context", method="extract_context"),
        Output(display_name="Original Text", name="original", method="get_original"),
        Output(display_name="Search Query", name="query", method="get_query"),
    ]

    def extract_context(self) -> Message:
        """Extract the context prompt from the input text and return as Message."""
        try:
            text = self.input_text.strip()
            if not text:
                context_text = self.fallback_query
            else:
                # Look for the context prompt section
                context_marker = self.context_marker.strip()
                
                # Try to find the context prompt using the marker
                if context_marker in text:
                    # Split by the context marker and take everything after it
                    parts = text.split(context_marker, 1)
                    if len(parts) > 1:
                        context_text = parts[1].strip()
                        
                        # Remove any trailing text after the context (like "Using this context...")
                        # Look for common patterns that indicate the end of the context
                        end_patterns = [
                            r'\n\nUsing this context',
                            r'\n\n---\n\n',
                            r'\n\nYou can use this',
                            r'\n\nThis context',
                            r'\n\nWith this',
                        ]
                        
                        for pattern in end_patterns:
                            match = re.search(pattern, context_text, re.IGNORECASE)
                            if match:
                                context_text = context_text[:match.start()].strip()
                                break
                        
                        # Clean up the context text
                        context_text = self._clean_context_text(context_text)
                        
                        if not context_text:
                            context_text = self.fallback_query
                    else:
                        context_text = self.fallback_query
                else:
                    # If no context marker found, try to extract from quoted text
                    quoted_context = self._extract_quoted_context(text)
                    if quoted_context:
                        context_text = quoted_context
                    else:
                        # If still no context found, try to extract the main recommendation request
                        recommendation_context = self._extract_recommendation_context(text)
                        if recommendation_context:
                            context_text = recommendation_context
                        else:
                            # Fallback to the provided fallback query
                            context_text = self.fallback_query

            # Create and return Message object
            return Message(
                text=context_text,
                additional_kwargs={
                    "extracted_context": context_text,
                    "original_text": self.input_text,
                    "context_marker_used": self.context_marker,
                    "extraction_method": "context_extractor"
                }
            )

        except Exception as e:
            self.log(f"Error extracting context: {e}")
            return Message(
                text=self.fallback_query,
                additional_kwargs={
                    "extracted_context": self.fallback_query,
                    "original_text": self.input_text,
                    "error": str(e),
                    "extraction_method": "fallback"
                }
            )

    def get_original(self) -> Message:
        """Return the original input text as a Message."""
        return Message(
            text=self.input_text,
            additional_kwargs={
                "original_text": self.input_text,
                "source": "context_extractor_original"
            }
        )

    def get_query(self) -> Message:
        """Return the extracted context as a search query Message."""
        context_message = self.extract_context()
        return Message(
            text=context_message.text,
            additional_kwargs={
                **context_message.additional_kwargs,
                "query_type": "search_query"
            }
        )

    def _clean_context_text(self, text: str) -> str:
        """Clean and format the extracted context text."""
        # Remove markdown formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove bold
        text = re.sub(r'\*(.*?)\*', r'\1', text)      # Remove italic
        text = re.sub(r'`(.*?)`', r'\1', text)        # Remove code formatting
        
        # Remove extra whitespace and newlines
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove quotes if the entire text is quoted
        text = text.strip()
        if text.startswith('"') and text.endswith('"'):
            text = text[1:-1]
        elif text.startswith("'") and text.endswith("'"):
            text = text[1:-1]
        
        # Remove trailing dashes or other artifacts
        text = re.sub(r'\s*---+\s*$', '', text)
        text = re.sub(r'\s*\.\.\.\s*$', '', text)
        
        return text.strip()

    def _extract_quoted_context(self, text: str) -> Optional[str]:
        """Extract context from quoted text in the input."""
        # Look for text within quotes that contains recommendation language
        quote_patterns = [
            r'"([^"]*(?:recommend|similar|games|board|play)[^"]*)"',
            r"'([^']*(?:recommend|similar|games|board|play)[^']*)'",
        ]
        
        for pattern in quote_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) > 20:  # Ensure it's substantial text
                    return self._clean_context_text(match)
        
        return None

    def _extract_recommendation_context(self, text: str) -> Optional[str]:
        """Extract context from recommendation-style text."""
        # Look for sentences that contain recommendation language
        recommendation_patterns = [
            r'(?:find|look for|recommend|suggest).*?games.*?(?:similar|like).*?(?:in terms of|with).*?[.!?]',
            r'(?:please provide|give me).*?games.*?(?:similar|like).*?[.!?]',
            r'(?:recommendations should|look for games that).*?[.!?]',
        ]
        
        for pattern in recommendation_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if len(match) > 30:  # Ensure it's substantial text
                    return self._clean_context_text(match)
        
        return None

    def build(self) -> Data:
        """Build the component and return the extracted context as Data."""
        context_message = self.extract_context()
        
        return Data(
            value=context_message,
            display_name="Extracted Context",
            type="message"
        )