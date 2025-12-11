{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "b1b37913",
   "metadata": {},
   "outputs": [],
   "source": [
    "# extract_features.py\n",
    "import re\n",
    "from urllib.parse import urlparse\n",
    "\n",
    "PHISH_KEYWORDS = [\n",
    "    \"login\",\"logon\",\"signin\",\"verify\",\"verification\",\"update\",\n",
    "    \"secure\",\"security\",\"account\",\"password\",\"bank\",\"payment\",\n",
    "    \"confirm\",\"webscr\",\"billing\",\"credential\"\n",
    "]\n",
    "\n",
    "BRAND_KEYWORDS = [\n",
    "    \"paypal\",\"apple\",\"google\",\"amazon\",\"microsoft\",\"netflix\",\"bank\",\n",
    "    \"hdfc\",\"sbi\",\"icici\",\"facebook\",\"instagram\"\n",
    "]\n",
    "\n",
    "def extract_features(url: str) -> dict:\n",
    "    parsed = urlparse(url)\n",
    "    domain = parsed.netloc\n",
    "    path = parsed.path\n",
    "    query = parsed.query\n",
    "    full = url.lower()\n",
    "\n",
    "    tld = domain.split(\".\")[-1] if \".\" in domain else \"\"\n",
    "    suspicious_ext = (\".html\",\".htm\",\".php\",\".asp\",\".aspx\",\".exe\",\".apk\",\".zip\")\n",
    "\n",
    "    tld_pop_map = {\n",
    "        \"com\":100,\"org\":90,\"net\":85,\"edu\":80,\"gov\":75,\"co\":70,\n",
    "        \"in\":65,\"io\":60,\"info\":30,\"xyz\":20\n",
    "    }\n",
    "\n",
    "    url_len = len(url)\n",
    "    digits_count = sum(c.isdigit() for c in url)\n",
    "\n",
    "    keyword_count = sum(full.count(k) for k in PHISH_KEYWORDS)\n",
    "    has_suspicious_keyword = int(any(k in full for k in PHISH_KEYWORDS))\n",
    "    has_brand_keyword = int(any(b in full for b in BRAND_KEYWORDS))\n",
    "\n",
    "    return {\n",
    "        \"url_length\": url_len,\n",
    "        \"has_ip_address\": int(bool(re.match(r\"(\\d{1,3}\\.){3}\\d{1,3}\", domain))),\n",
    "        \"dot_count\": url.count(\".\"),\n",
    "        \"https_flag\": int(parsed.scheme == \"https\"),\n",
    "        \"url_entropy\": (len(set(url)) / url_len) if url_len else 0,\n",
    "        \"token_count\": url.count(\"/\") + url.count(\"?\") + url.count(\"&\") + url.count(\"=\"),\n",
    "        \"subdomain_count\": domain.count(\".\"),\n",
    "        \"query_param_count\": query.count(\"&\") + query.count(\"=\"),\n",
    "        \"tld_length\": len(tld),\n",
    "        \"path_length\": len(path),\n",
    "        \"has_hyphen_in_domain\": int(\"-\" in domain),\n",
    "        \"number_of_digits\": digits_count,\n",
    "        \"tld_popularity\": tld_pop_map.get(tld, 10),\n",
    "        \"suspicious_file_extension\": int(path.endswith(suspicious_ext)),\n",
    "        \"domain_name_length\": len(domain),\n",
    "        \"percentage_numeric_chars\": (digits_count / url_len * 100) if url_len else 0,\n",
    "        \"keyword_count\": keyword_count,\n",
    "        \"has_suspicious_keyword\": has_suspicious_keyword,\n",
    "        \"has_brand_keyword\": has_brand_keyword,\n",
    "    }\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "9e5d94d8",
   "metadata": {},
   "outputs": [
    {
     "ename": "NameError",
     "evalue": "name 'training_features' is not defined",
     "output_type": "error",
     "traceback": [
      "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[1;31mNameError\u001b[0m                                 Traceback (most recent call last)",
      "Cell \u001b[1;32mIn[5], line 3\u001b[0m\n\u001b[0;32m      1\u001b[0m \u001b[38;5;28;01mimport\u001b[39;00m\u001b[38;5;250m \u001b[39m\u001b[38;5;21;01mjoblib\u001b[39;00m\n\u001b[0;32m      2\u001b[0m \u001b[38;5;66;03m# joblib.dump(best_model, \"best_model.pkl\")\u001b[39;00m\n\u001b[1;32m----> 3\u001b[0m joblib\u001b[38;5;241m.\u001b[39mdump(\u001b[43mtraining_features\u001b[49m, \u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mtraining_columns.pkl\u001b[39m\u001b[38;5;124m\"\u001b[39m)\n",
      "\u001b[1;31mNameError\u001b[0m: name 'training_features' is not defined"
     ]
    }
   ],
   "source": [
    "import joblib\n",
    "# joblib.dump(best_model, \"best_model.pkl\")\n",
    "joblib.dump(training_features, \"training_columns.pkl\")\n"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.10.11"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
