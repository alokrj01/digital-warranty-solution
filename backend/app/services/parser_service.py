import re
from datetime import datetime

def normalize_date(date_str: str):
    """Convert any date format to YYYY-MM-DD"""
    formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y",
        "%d %b, %Y", "%d %b %Y", "%B %d, %Y",
        "%d/%m/%y", "%d-%m-%y", "%Y-%m-%d",
        "%d %b, %Y, %I:%M %p",
    ]
    for fmt in formats:
        try:
            clean = re.sub(r",?\s+\d{2}:\d{2}\s+[AP]M", "", date_str.strip())
            return datetime.strptime(date_str.strip(), fmt).strftime("%Y-%m-%d")
        except:
            continue
    return None


def extract_date(text: str):
    patterns = [
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",           # 24/07/2021
        r"\b\d{1,2}\s+\w{3},?\s+\d{4}\b",                # 24 Jul, 2021
        r"\b\w{3,9}\s+\d{1,2},?\s+\d{4}\b",              # July 24, 2021
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            result = normalize_date(match.group())
            if result:
              return result
    return None


def extract_amount(text: str):
    # Priority: "Rs. AMOUNT" pattern (most reliable in Indian receipts)
    # Search all "Rs. X" occurrences, take the last one
    rs_matches = re.findall(r"Rs\.?\s*([\d,]+(?:\.\d{1,2})?)", text, re.IGNORECASE)
    if rs_matches:
        try:
            return float(rs_matches[-1].replace(",", ""))
        except:
            pass

    # Priority 2: ₹ symbol
    inr_matches = re.findall(r"₹\s*([\d,]+(?:\.\d{1,2})?)", text)
    if inr_matches:
        try:
            return float(inr_matches[-1].replace(",", ""))
        except:
            pass

    # Priority 3: Total/Grand Total keyword
    total_patterns = [
        r"Total\s+Amount\s+Paid\s*[:\-]?\s*(?:Rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)",
        r"Grand\s+Total\s*[:\-]?\s*(?:Rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)",
        r"Net\s+(?:Amount|Total)\s*[:\-]?\s*(?:Rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)",
    ]
    for pattern in total_patterns:
        matches = list(re.finditer(pattern, text, re.IGNORECASE))
        if matches:
            try:
                return float(matches[-1].group(1).replace(",", ""))
            except:
                continue

    # Fallback: largest number under 1 lakh (skip phone numbers)
    all_nums = re.findall(r"\b(\d{1,6}(?:\.\d{1,2})?)\b", text)
    amounts = []
    for n in all_nums:
        try:
            val = float(n)
            if 1 < val < 100000:
                amounts.append(val)
        except:
            continue
    return max(amounts) if amounts else None


def extract_product(text: str):
     # Strategy 0: Paytm style — "Operator" header ke baad ki line mein second word
    lines = text.split("\n")
    for i, line in enumerate(lines):
       if line.strip().lower() == "operator":
            for j in range(i+1, min(i+6, len(lines))):
                next_line = lines[j].strip()
                if not next_line:
                    continue
                # Skip karo agar ye sirf header words hain
                skip = ["total", "amount", "paid", "recharge", "number", "payment"]
                if any(s in next_line.lower() for s in skip):
                    continue
                # Skip karo pure numbers
                if re.match(r"^[\d\s\.\,]+$", next_line):
                    continue
                # Ye clean word hai — return karo
                return next_line.strip()
            break
    
    # Strategy 1: "Operator" label → next token on same line
    op_match = re.search(r"Operator\s*\n?\s*(.+)", text, re.IGNORECASE)
    if op_match:
        val = op_match.group(1).strip().split("\n")[0].strip()
        if val and not val.isdigit() and len(val) > 1:
            return val

    # Strategy 2: "Merchant / Store / Paid to" labels
    label_patterns = [
        r"(?:Merchant|Store|Shop|Vendor|Brand|Service|Paid\s+to)\s*[:\-]?\s*(.+)",
        r"(?:Recharge\s+of|Bill\s+for)\s+(.+)",
    ]
    for pattern in label_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            val = match.group(1).strip().split("\n")[0]
            if val and not val.isdigit():
                return val

    # Strategy 3: First clean meaningful line (skip noise)
    skip_keywords = [
        "total", "amount", "tax", "invoice", "receipt", "bill",
        "qty", "price", "subtotal", "payment", "date", "order",
        "transaction", "upi", "gst", "hsn", "rs.", "inr",
        "disclaimer", "note", "subject", "paytm", "bbps",
        "recharge", "operator", "convenience", "reference",
        "कुल", "जमा", "रकम", "रसीद", "बिल", "कर"
    ]
    for line in text.split("\n"):
        line = line.strip()
        if len(line) < 3:
            continue
        if re.match(r"^[\d\W]+$", line):  # pure numbers/symbols
            continue
        if any(kw in line.lower() for kw in skip_keywords):
            continue
        return line

    return "Unknown Product"


def extract_data(text: str):
    return {
        "date": extract_date(text),
        "amount": extract_amount(text),
        "product": extract_product(text),
    }