import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  ExternalLink
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ApiDocs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/convert",
      description: "Convert between healthcare data formats",
      params: [
        { name: "sourceFormat", type: "string", required: true, description: "Source format (HL7, EDI_837, EDI_835, EDI_270, EDI_271)" },
        { name: "targetFormat", type: "string", required: true, description: "Target format (FHIR)" },
        { name: "data", type: "string", required: true, description: "Source data to convert" }
      ]
    },
    {
      method: "POST",
      path: "/api/validate",
      description: "Validate FHIR resources",
      params: [
        { name: "data", type: "object", required: true, description: "FHIR resource or bundle to validate" },
        { name: "profile", type: "string", required: false, description: "FHIR profile to validate against" }
      ]
    },
    {
      method: "GET",
      path: "/api/health",
      description: "API health check",
      params: []
    }
  ];

  const messageTypes = [
    {
      id: "hl7",
      name: "HL7 v2 Messages",
      description: "Traditional healthcare messaging standard",
      formats: [
        {
          code: "ADT",
          name: "Admission, Discharge, Transfer",
          description: "Patient demographics, visit information, and administrative events",
          example: `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20231215120000||ADT^A01|12345|P|2.5|||AL|NE|
EVN|A01|20231215120000|||
PID|1||123456789|0123456|Doe^John^A||19800315|M||C|123 Main St^^Springfield^IL^62701||555-123-4567|||M|NON|123456789|
PV1|1|I|2000^2012^01||||123456^Smith^John^A|||SUR||||2|A0|`,
          fhirResources: ["Patient", "Encounter", "Organization"]
        },
        {
          code: "ORU",
          name: "Observational Result Unsolicited",
          description: "Laboratory results, diagnostic reports, and clinical observations",
          example: `MSH|^~\\&|LAB_SYSTEM|LAB_FACILITY|EMR|HOSPITAL|20231215143000||ORU^R01|98765|P|2.5|||AL|NE|
PID|1||987654321|0123456|Smith^Jane^M||19750522|F||C|456 Oak Ave^^Chicago^IL^60601||312-555-8901|||S|NON|987654321|
OBR|1|12345|67890|80061^LIPID PANEL^CPT||20231215090000|20231215093000|||DR^Jones^Sarah|||20231215093000||||||20231215143000|||F|||
OBX|1|NM|13457-7^LDL CHOLESTEROL^LOINC||125|mg/dL|<130|N|||F|||20231215143000|
OBX|2|NM|2093-3^TOTAL CHOLESTEROL^LOINC||200|mg/dL|<200|N|||F|||20231215143000|`,
          fhirResources: ["Patient", "Observation", "DiagnosticReport", "Practitioner"]
        },
        {
          code: "ORM",
          name: "Order Message",
          description: "Laboratory orders, service requests, and clinical orders",
          example: `MSH|^~\\&|CPOE|HOSPITAL|LAB|LAB|20231215100000||ORM^O01|54321|P|2.5|||AL|NE|
PID|1||135792468||Johnson^Robert^L||19650810|M||B|789 Pine St^^Boston^MA^02101||617-555-2345|||M|NON|135792468|
ORC|NW|ORD-12345||||||20231215100000||DOC^Smith^Michael|||
OBR|1|ORD-12345||85025^COMPLETE BLOOD COUNT^CPT||20231215100000|||||||||DOC^Smith^Michael||||||||||ROUTINE|`,
          fhirResources: ["Patient", "ServiceRequest", "Practitioner"]
        }
      ]
    },
    {
      id: "edi",
      name: "EDI Transactions",
      description: "Electronic Data Interchange for healthcare claims and administrative transactions",
      formats: [
        {
          code: "837",
          name: "Healthcare Claims (837P/837I)",
          description: "Professional and institutional healthcare claim submissions",
          example: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
GS*HC*SENDER*RECEIVER*20241122*1430*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*1*20241122*1430*CH~
NM1*41*2*ACME HEALTHCARE*****46*TIN123456789~
PER*IC*CONTACT PERSON*TE*5551234567~
NM1*40*2*BLUE CROSS BLUE SHIELD*****46*87654321~
HL*1**20*1~
PRV*BI*PXC*207Q00000X~
NM1*85*2*PROVIDER CLINIC*****XX*1234567890~
N3*123 MAIN ST~
N4*ANYTOWN*ST*12345*US~
REF*EI*123456789~
HL*2*1*22*0~
SBR*P*18*GROUP123**CI****11~
NM1*IL*1*DOE*JANE****MI*MEMBER123~
N3*456 ELM ST~
N4*ANYTOWN*ST*12345*US~
DMG*D8*19800315*F~
NM1*PR*2*BLUE CROSS BLUE SHIELD*****PI*87654321~
CLM*CLAIM001*100.00***11:B:1*Y*A*Y*I~
DTP*431*D8*20241120~
REF*D9*DIAGNOSIS1~
HI*BK:Z87891~
HL*3*2*23*0~
LX*1~
SV1*HC:99213*75.00*UN*1***1~
DTP*472*D8*20241120~
LX*2~
SV1*HC:99214*25.00*UN*1***1~
DTP*472*D8*20241120~
SE*30*0001~
GE*1*1~
IEA*1*000000001~`,
          fhirResources: ["Patient", "Organization", "Claim", "Coverage", "Practitioner", "Procedure"]
        },
        {
          code: "835",
          name: "Healthcare Payment & Remittance (835)",
          description: "Healthcare claim payment and remittance advice",
          example: `ISA*00*          *00*          *ZZ*PAYER          *ZZ*PROVIDER       *241122*1430*^*00501*000000001*0*T*:~
GS*HP*PAYER*PROVIDER*20241122*1430*1*X*005010X221A1~
ST*835*0001*005010X221A1~
BPR*I*1500.00*C*ACH*CCP*01*999999999*DA*123456789****20241122~
TRN*1*12345*1234567890~
DTM*405*20241122~
N1*PR*BLUE CROSS BLUE SHIELD*XX*87654321~
N3*PO BOX 12345~
N4*ANYTOWN*ST*12345*US~
N1*PE*PROVIDER CLINIC*XX*1234567890~
N3*123 MAIN ST~
N4*ANYTOWN*ST*12345*US~
LX*1~
CLP*CLAIM001*1*100.00*85.00**MC*CLAIM001*11~
NM1*QC*1*DOE*JANE****MI*MEMBER123~
NM1*82*1*PROVIDER*JOHN****XX*1234567890~
DTM*232*20241120~
DTM*233*20241120~
SVC*HC:99213*75.00*70.00**1~
DTM*472*20241120~
CAS*CO*45*5.00~
REF*6R*LINE001~
SVC*HC:99214*25.00*15.00**1~
DTM*472*20241120~
CAS*CO*45*10.00~
REF*6R*LINE002~
PLB*1234567890*20241122*CV:REFUND*-50.00~
SE*25*0001~
GE*1*1~
IEA*1*000000001~`,
          fhirResources: ["Patient", "PaymentNotice", "ExplanationOfBenefit", "Organization", "PaymentReconciliation"]
        },
        {
          code: "270",
          name: "Healthcare Eligibility Inquiry (270)",
          description: "Healthcare eligibility, coverage, or benefits inquiry",
          example: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
GS*HS*SENDER*RECEIVER*20241122*1430*1*X*005010X279A1~
ST*270*0001*005010X279A1~
BHT*0022*13*10001234*20241122*1430~
HL*1**20*1~
NM1*PR*2*BLUE CROSS BLUE SHIELD*****PI*87654321~
HL*2*1*21*1~
NM1*1P*1*PROVIDER*JOHN****XX*1234567890~
PRV*PE*PXC*207Q00000X~
HL*3*2*22*0~
TRN*1*93175-012547*9877281234~
NM1*IL*1*DOE*JANE****MI*MEMBER123~
DMG*D8*19800315*F~
DTP*291*D8*20241122~
EQ*30~
SE*14*0001~
GE*1*1~
IEA*1*000000001~`,
          fhirResources: ["Patient", "Coverage", "CoverageEligibilityRequest", "Organization", "Practitioner"]
        },
        {
          code: "271",
          name: "Healthcare Eligibility Response (271)",
          description: "Healthcare eligibility, coverage, or benefits response",
          example: `ISA*00*          *00*          *ZZ*RECEIVER       *ZZ*SUBMITTER      *241122*1430*^*00501*000000001*0*T*:~
GS*HB*RECEIVER*SUBMITTER*20241122*1430*1*X*005010X279A1~
ST*271*0001*005010X279A1~
BHT*0022*11*10001234*20241122*1430~
HL*1**20*1~
NM1*PR*2*BLUE CROSS BLUE SHIELD*****PI*87654321~
HL*2*1*21*1~
NM1*1P*1*PROVIDER*JOHN****XX*1234567890~
HL*3*2*22*0~
TRN*2*93175-012547*9877281234~
NM1*IL*1*DOE*JANE****MI*MEMBER123~
REF*SY*MEMBER123~
N3*456 ELM ST~
N4*ANYTOWN*ST*12345*US~
DMG*D8*19800315*F~
INS*Y*18*001*25*A***FT~
DTP*346*D8*20240101~
DTP*347*D8*20241231~
EB*1*FAM*30**27~
EB*B*FAM*30**27*2500.00~
EB*C*FAM*30**27*500.00~
EB*F*FAM*30**27*20~
EB*G*IND*30**27*1000.00~
EB*A*IND*30**27*5000.00~
MSG*MEMBER IS ELIGIBLE FOR COVERED SERVICES~
SE*22*0001~
GE*1*1~
IEA*1*000000001~`,
          fhirResources: ["Patient", "Coverage", "CoverageEligibilityResponse", "Organization", "InsurancePlan"]
        }
      ]
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const response = await fetch('https://api.mediconnect.io/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here'
  },
  body: JSON.stringify({
    sourceFormat: 'HL7',
    targetFormat: 'FHIR',
    data: hl7Message
  })
});

const result = await response.json();
if (result.success) {
  const fhirBundle = JSON.parse(result.convertedData);
  console.log('FHIR Bundle:', fhirBundle);
} else {
  console.error('Conversion error:', result.errorMessage);
}`,
    python: `# Python Example
import requests
import json

url = "https://api.mediconnect.io/convert"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "your_api_key_here"
}

payload = {
    "sourceFormat": "HL7",
    "targetFormat": "FHIR", 
    "data": hl7_message
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()

if result["success"]:
    fhir_bundle = json.loads(result["convertedData"])
    print("FHIR Bundle:", fhir_bundle)
else:
    print("Conversion error:", result["errorMessage"])`,
    curl: `# cURL Example
curl -X POST https://api.mediconnect.io/convert \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{
    "sourceFormat": "HL7",
    "targetFormat": "FHIR",
    "data": "MSH|^~\\&|SENDING_APP|..."
  }'`
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Comprehensive guide to integrating healthcare data conversion into your applications
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <a href="#quick-start" className="block text-sm text-primary hover:underline">Quick Start</a>
                  <a href="#authentication" className="block text-sm text-primary hover:underline">Authentication</a>
                  <a href="#endpoints" className="block text-sm text-primary hover:underline">API Endpoints</a>
                  <a href="#message-types" className="block text-sm text-primary hover:underline">Message Types</a>
                  <a href="#hl7-formats" className="block text-sm text-primary hover:underline">HL7 Formats</a>
                  <a href="#edi-formats" className="block text-sm text-primary hover:underline">EDI Formats</a>
                  <a href="#code-examples" className="block text-sm text-primary hover:underline">Code Examples</a>
                  <a href="#error-handling" className="block text-sm text-primary hover:underline">Error Handling</a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Documentation */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start */}
            <section id="quick-start">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Get started with MediConnect API in minutes. Convert healthcare data formats with a simple REST API call.
                  </p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-white hover:bg-white/10"
                      onClick={() => copyToClipboard(codeExamples.javascript, 'quick-start')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="text-sm overflow-x-auto">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    All API requests require authentication using an API key passed in the <code className="bg-muted px-1 rounded">X-API-Key</code> header.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Getting Your API Key</span>
                    </div>
                    <p className="text-blue-800 text-sm">
                      Contact us at <a href="mailto:contact@nubitsaitech.com" className="underline">contact@nubitsaitech.com</a> to get your API key for early access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* API Endpoints */}
            <section id="endpoints">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {endpoints.map((endpoint, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-muted-foreground mb-3">{endpoint.description}</p>
                        {endpoint.params.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Parameters</h5>
                            <div className="space-y-2">
                              {endpoint.params.map((param, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                  <code className="bg-muted px-2 py-1 rounded min-w-0 flex-shrink-0">
                                    {param.name}
                                  </code>
                                  <Badge variant={param.required ? 'destructive' : 'secondary'} className="text-xs">
                                    {param.required ? 'Required' : 'Optional'}
                                  </Badge>
                                  <span className="text-muted-foreground">{param.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Message Types */}
            <section id="message-types">
              <Card>
                <CardHeader>
                  <CardTitle>Supported Message Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="hl7" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="hl7">HL7 v2 Messages</TabsTrigger>
                      <TabsTrigger value="edi">EDI Transactions</TabsTrigger>
                    </TabsList>
                    
                    {messageTypes.map((category) => (
                      <TabsContent key={category.id} value={category.id} className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                          <p className="text-muted-foreground mb-6">{category.description}</p>
                          
                          <div className="space-y-6">
                            {category.formats.map((format, index) => (
                              <div key={index} className="border rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge className="bg-gradient-medical text-white">
                                    {format.code}
                                  </Badge>
                                  <h4 className="text-xl font-semibold">{format.name}</h4>
                                </div>
                                
                                <p className="text-muted-foreground mb-4">{format.description}</p>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-medium mb-2">Example Message</h5>
                                    <div className="bg-slate-900 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-40">
                                      <pre>{format.example}</pre>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium mb-2">Generated FHIR Resources</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {format.fhirResources.map((resource, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {resource}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Code Examples */}
            <section id="code-examples">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(codeExamples).map(([lang, code]) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-white hover:bg-white/10"
                            onClick={() => copyToClipboard(code, lang)}
                          >
                            {copiedCode === lang ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <pre className="text-sm overflow-x-auto">
                            <code>{code}</code>
                          </pre>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Error Handling */}
            <section id="error-handling">
              <Card>
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The API returns structured error responses to help you debug integration issues.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">HTTP Status Codes</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800">200</Badge>
                          <span>Success - Conversion completed</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800">400</Badge>
                          <span>Bad Request - Invalid input format</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800">401</Badge>
                          <span>Unauthorized - Invalid API key</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800">429</Badge>
                          <span>Rate Limited - Too many requests</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800">500</Badge>
                          <span>Server Error - Internal processing error</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Error Response Format</h5>
                      <div className="bg-slate-900 text-green-400 p-4 rounded-lg">
                        <pre className="text-sm">{`{
  "success": false,
  "errorMessage": "Invalid HL7 message format: Missing MSH segment",
  "errorCode": "INVALID_FORMAT",
  "details": {
    "line": 1,
    "position": 0,
    "expected": "MSH segment"
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApiDocs;