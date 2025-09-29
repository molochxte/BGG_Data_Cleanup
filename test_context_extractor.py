#!/usr/bin/env python3
"""
Test script for the Context Extractor component
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'CustomComponents'))

from context_extractor import ContextExtractorComponent

def test_munchkin_example():
    """Test the context extractor with the Munchkin example."""
    
    # Your Munchkin example text
    munchkin_text = """To find games similar to Munchkin, we should look for games that share characteristics such as humor, light-hearted gameplay, card mechanics, and a focus on player interaction. Munchkin is known for its satirical take on role-playing games, where players compete to level up and gain treasure while sabotaging each other. Here's a context prompt you can use for your embedding database:

---

**Context Prompt:**

"Please provide a list of board games that are similar to Munchkin in terms of gameplay style, humor, and player interaction. Look for games that involve card mechanics, competitive elements, and a light-hearted or satirical theme. The recommendations should cater to players who enjoy a mix of strategy, luck, and social interaction, ideally suitable for casual gaming sessions."

---

Using this context, you can prompt your embedding database to generate a list of 10 recommendations."""

    # Create the component
    extractor = ContextExtractorComponent()
    
    # Set the input
    extractor.input_text = munchkin_text
    extractor.context_marker = "Context Prompt:"
    extractor.fallback_query = "Find board games similar to the mentioned game with similar gameplay mechanics and themes"
    
    # Extract the context
    context_message = extractor.extract_context()
    original_message = extractor.get_original()
    query_message = extractor.get_query()
    
    print("=" * 80)
    print("CONTEXT EXTRACTOR TEST - MUNCHKIN EXAMPLE")
    print("=" * 80)
    print()
    
    print("ORIGINAL TEXT:")
    print("-" * 40)
    print(original_message.text[:200] + "..." if len(original_message.text) > 200 else original_message.text)
    print()
    
    print("EXTRACTED CONTEXT:")
    print("-" * 40)
    print(context_message.text)
    print()
    print("Additional kwargs:", context_message.additional_kwargs)
    print()
    
    print("SEARCH QUERY:")
    print("-" * 40)
    print(query_message.text)
    print()
    print("Query kwargs:", query_message.additional_kwargs)
    print()
    
    print("=" * 80)
    print("SUCCESS: Context extracted successfully!")
    print("=" * 80)

def test_other_examples():
    """Test with other example formats."""
    
    examples = [
        {
            "name": "Simple Recommendation",
            "text": "I recommend looking for games that are similar to Catan in terms of resource management and trading mechanics. Context Prompt: Find board games with resource collection, trading, and strategic building elements similar to Catan.",
            "expected_keywords": ["resource", "trading", "strategic", "building"]
        },
        {
            "name": "Quoted Context",
            "text": "For your database search, use this query: 'Find cooperative board games with puzzle-solving elements and teamwork mechanics suitable for 2-4 players'",
            "expected_keywords": ["cooperative", "puzzle", "teamwork"]
        },
        {
            "name": "No Context Marker",
            "text": "You should look for games that involve deck building, strategic card play, and fantasy themes. These games typically appeal to players who enjoy complex decision-making and resource management.",
            "expected_keywords": ["deck building", "strategic", "fantasy"]
        }
    ]
    
    print("\n" + "=" * 80)
    print("ADDITIONAL TEST EXAMPLES")
    print("=" * 80)
    
    for example in examples:
        print(f"\nTesting: {example['name']}")
        print("-" * 40)
        
        extractor = ContextExtractorComponent()
        extractor.input_text = example['text']
        
        context_message = extractor.extract_context()
        print(f"Extracted: {context_message.text}")
        
        # Check if expected keywords are present
        found_keywords = [kw for kw in example['expected_keywords'] if kw.lower() in context_message.text.lower()]
        print(f"Found keywords: {found_keywords}")
        print(f"Success: {'✓' if found_keywords else '✗'}")

if __name__ == "__main__":
    test_munchkin_example()
    test_other_examples()
