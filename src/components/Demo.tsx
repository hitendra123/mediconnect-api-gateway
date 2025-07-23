import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, CheckCircle, AlertCircle, Download, Eye, FileCheck, Activity, Stethoscope, Heart } from "lucide-react";

interface ValidationResult {
  isValid: boolean;
  summary: string;
  issues: Array<{
    severity: string;
    location: string;
    details: string;
  }>;
  issueCounts?: Record<string, number>;
}

const Demo = () => {
  const [selectedMessage, setSelectedMessage] = useState("ADT");
  const [hl7Input, setHL7Input] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showJsonView, setShowJsonView] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [conversionTime, setConversionTime] = useState<number | null>(null);

  // Updated API Configuration with the real URL
  const API_URL = 'https://mediconnect-api-ayftgpd5a9bdhzcu.canadacentral-01.azurewebsites.net';
  const DEMO_API_KEY = 'demo_key_12345';

  const sampleMessages = {
    ADT: {
      name: "Patient Admission (ADT)",
      description: "Patient demographics and visit information",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "👤",
      data: `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20231215120000||ADT^A01|12345|P|2.5|||AL|NE|
EVN|A01|20231215120000|||
PID|1||123456789|0123456|Doe^John^A||19800315|M||C|123 Main St^^Springfield^IL^62701||555-123-4567|||M|NON|123456789|
PV1|1|I|2000^2012^01||||123456^Smith^John^A|||SUR||||2|A0|`,
      expectedResources: ["Patient", "Encounter"]
    },
    ORU: {
      name: "Lab Results (ORU)",
      description: "Laboratory test results with observations",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "🧪",
      data: `MSH|^~\\&|LAB_SYSTEM|LAB_FACILITY|EMR|HOSPITAL|20231215143000||ORU^R01|98765|P|2.5|||AL|NE|
PID|1||987654321|0123456|Smith^Jane^M||19750522|F||C|456 Oak Ave^^Chicago^IL^60601||312-555-8901|||S|NON|987654321|
OBR|1|12345|67890|80061^LIPID PANEL^CPT||20231215090000|20231215093000|||DR^Jones^Sarah|||20231215093000||||||20231215143000|||F|||
OBX|1|NM|13457-7^LDL CHOLESTEROL^LOINC||125|mg/dL|<130|N|||F|||20231215143000|
OBX|2|NM|2093-3^TOTAL CHOLESTEROL^LOINC||200|mg/dL|<200|N|||F|||20231215143000|
OBX|3|NM|2085-9^HDL CHOLESTEROL^LOINC||45|mg/dL|>40|N|||F|||20231215143000|
OBX|4|NM|2571-8^TRIGLYCERIDES^LOINC||150|mg/dL|<150|N|||F|||20231215143000|`,
      expectedResources: ["Patient", "Observation", "DiagnosticReport", "Practitioner"]
    },
    ORM: {
      name: "Lab Order (ORM)",
      description: "Service orders for labs, radiology, etc.",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: "📋",
      data: `MSH|^~\\&|CPOE|HOSPITAL|LAB|LAB|20231215100000||ORM^O01|54321|P|2.5|||AL|NE|
PID|1||135792468||Johnson^Robert^L||19650810|M||B|789 Pine St^^Boston^MA^02101||617-555-2345|||M|NON|135792468|
ORC|NW|ORD-12345||||||20231215100000||DOC^Smith^Michael|||
OBR|1|ORD-12345||85025^COMPLETE BLOOD COUNT^CPT||20231215100000|||||||||DOC^Smith^Michael||||||||||ROUTINE|`,
      expectedResources: ["Patient", "ServiceRequest"]
    },
    MDM: {
      name: "Medical Document (MDM)",
      description: "Clinical notes and documents",
      color: "bg-teal-100 text-teal-800 border-teal-200",
      icon: "📄",
      data: `MSH|^~\\&|TRANSCRIPTION|HOSPITAL|EMR|HOSPITAL|20231215160000||MDM^T02|11111|P|2.3|||AL|NE|
EVN|T02|20231215160000||||
PID|1||246813579||Williams^Mary^E||19700225|F||W|321 Elm St^^Seattle^WA^98101||206-555-6789|||S|NON|246813579|
TXA|1|DS|TX|20231215160000|DOC^Johnson^Lisa||||||||DOC-98765|||||AU||
OBX|1|TX|11488-4^CONSULTATION NOTE^LOINC||Patient presents with complaints of persistent headache for 3 days.||||||F|||20231215160000|
OBX|2|TX|11488-4^CONSULTATION NOTE^LOINC||Physical examination reveals normal vital signs. No neurological deficits noted.||||||F|||20231215160000|
OBX|3|TX|11488-4^CONSULTATION NOTE^LOINC||Recommended OTC pain relief and follow-up if symptoms persist beyond 1 week.||||||F|||20231215160000|`,
      expectedResources: ["Patient", "DocumentReference", "Practitioner"]
    },
    RDE: {
      name: "Pharmacy Order (RDE)",
      description: "Medication prescriptions",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: "💊",
      data: `MSH|^~\\&|PHARMACY|HOSPITAL|PHARMACY_SYSTEM|HOSPITAL|20231215140000||RDE^O11|77777|P|2.5|||AL|NE|
PID|1||369258147||Anderson^Sarah^K||19820718|F||W|567 Maple Dr^^Portland^OR^97201||503-555-4321|||S|NON|369258147|
ORC|NW|RX-88888||||||20231215140000||DOC^Wilson^Emily|||
RXE|1^^HL70292|00069-0150-01^LISINOPRIL 10MG TABLET^NDC|10||MG^milligram|^PO^ORAL||30|TABLET|5||20231215140000|DOC^Wilson^Emily||||||||||||||
TQ1|1||1|D|||||QAM^Every morning|
RXR|^PO^ORAL|`,
      expectedResources: ["Patient", "MedicationRequest", "Medication", "Practitioner"]
    },
    EDI_837: {
      name: "EDI 837 Healthcare Claims",
      description: "Professional healthcare claims submission",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: "💰",
      data: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
GS*HC*SENDER*RECEIVER*20241122*1430*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*1*20241122*1430*CH~
NM1*41*2*ACME HEALTHCARE*****46*TIN123456789~
NM1*40*2*BCBS*****46*87654321~
HL*1**20*1~
NM1*85*2*PROVIDER CLINIC*****XX*1234567890~
N3*123 MAIN ST~
N4*ANYTOWN*ST*12345~
HL*2*1*22*0~
NM1*IL*1*DOE*JANE****MI*MEMBER123~
DMG*D8*19800315*F~
CLM*CLAIM001*100.00***11:B:1*Y*A*Y*I~
NM1*71*1*SMITH*JOHN****XX*1234567890~
SV1*HC:99213*75.00*UN*1***1~
SV1*HC:99214*25.00*UN*1***1~
SE*18*0001~
GE*1*1~
IEA*1*000000001~`,
      expectedResources: ["Patient", "Organization", "Claim", "Practitioner"]
    },
    DFT: {
      name: "Detailed Financial Transaction (DFT)",
      description: "Financial and billing information for healthcare services",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: "💳",
      data: `MSH|^~\\&|BILLING|HOSPITAL|FINANCE|HOSPITAL|20231215170000||DFT^P03|99999|P|2.5|||AL|NE|
EVN|P03|20231215170000||||
PID|1||159753486||Brown^Michael^J||19881205|M||AA|890 Cedar Ln^^Miami^FL^33101||305-555-7890|||M|NON|159753486|
PV1|1|O|OUTPT||||DOC^Taylor^Amanda|||CARDIO||||3|A0|
FT1|1||20231215170000|20231215170000|CG|99213^OFFICE VISIT ESTABLISHED PATIENT^CPT|Office Visit Level 3|1|150.00||||||DOC^Taylor^Amanda|CARDIO|
FT1|2||20231215170000|20231215170000|CG|93000^ELECTROCARDIOGRAM^CPT|EKG 12-Lead|1|75.00||||||DOC^Taylor^Amanda|CARDIO|
DG1|1|I10|I25.10^ATHEROSCLEROTIC HEART DISEASE^ICD10||20231215170000|||W|`,
      expectedResources: ["Patient", "Encounter", "ChargeItem", "Invoice", "Practitioner"]
    },
    SIU: {
      name: "Scheduling Information Unsolicited (SIU)",
      description: "Appointment scheduling and calendar management",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: "📅",
      data: `MSH|^~\\&|SCHEDULING|HOSPITAL|EMR|HOSPITAL|20231215180000||SIU^S12|88888|P|2.5|||AL|NE|
SCH|12345|67890|||||20231220100000|20231220103000|30|MIN|BOOKED||||||DOC^Wilson^Patricia|||ROUTINE|
TQ1|1||||||20231220100000|20231220103000|R|
PID|1||753951486||Davis^Jennifer^L||19920415|F||W|456 Birch Ave^^Denver^CO^80201||303-555-3456|||S|NON|753951486|
PV1|1|O|CLINIC^ROOM5^01||||DOC^Wilson^Patricia|||DERM||||1|A0|
RGS|1|A|
AIG|1|A|DOC^Wilson^Patricia|P|20231220100000|30|MIN|
AIL|1|A|CLINIC^ROOM5^01|L|20231220100000|30|MIN|
AIP|1|A|753951486|PAT|20231220100000|30|MIN|`,
      expectedResources: ["Patient", "Appointment", "Practitioner", "Location", "Schedule"]
    },
    EDI_835: {
      name: "EDI 835 Payment & Remittance",
      description: "Healthcare claim payment and remittance advice",
      color: "bg-violet-100 text-violet-800 border-violet-200",
      icon: "💵",
      data: `ISA*00*          *00*          *ZZ*PAYER          *ZZ*PROVIDER       *241122*1430*^*00501*000000001*0*T*:~
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
      expectedResources: ["Patient", "PaymentNotice", "ExplanationOfBenefit", "Organization", "PaymentReconciliation"]
    },
    EDI_270: {
      name: "EDI 270 Eligibility Inquiry",
      description: "Healthcare eligibility, coverage, or benefits inquiry",
      color: "bg-rose-100 text-rose-800 border-rose-200",
      icon: "🔍",
      data: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
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
      expectedResources: ["Patient", "Coverage", "CoverageEligibilityRequest", "Organization", "Practitioner"]
    },
    EDI_271: {
      name: "EDI 271 Eligibility Response",
      description: "Healthcare eligibility, coverage, or benefits response",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: "✅",
      data: `ISA*00*          *00*          *ZZ*RECEIVER       *ZZ*SUBMITTER      *241122*1430*^*00501*000000001*0*T*:~
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
      expectedResources: ["Patient", "Coverage", "CoverageEligibilityResponse", "Organization", "InsurancePlan"]
    }
  };

  const detectMessageType = (data: string): string => {
    const trimmedData = data.trim();

    // Check for EDI format (starts with ISA)
    if (trimmedData.startsWith('ISA*')) {
      if (trimmedData.includes('ST*837*')) return 'EDI_837';
      if (trimmedData.includes('ST*835*')) return 'EDI_835';
      if (trimmedData.includes('ST*270*')) return 'EDI_270';
      if (trimmedData.includes('ST*271*')) return 'EDI_271';
      return 'EDI_837'; // Default to 837 for demo
    }

    // Check for HL7 format (starts with MSH)
    if (trimmedData.startsWith('MSH|')) {
      const mshSegment = trimmedData.split('\n')[0] || trimmedData.split('\r')[0];
      const fields = mshSegment.split('|');

      if (fields.length > 8) {
        const messageType = fields[8]; // MSH-9 Message Type
        if (messageType.includes('^')) {
          return messageType.split('^')[0]; // Get the message type part (ADT, ORU, etc.)
        }
      }
      return 'ADT'; // Default to ADT if we can't parse
    }

    return 'HL7'; // Default fallback
  };

  const loadSampleMessage = (type: string) => {
    setSelectedMessage(type);
    setHL7Input(sampleMessages[type].data);
    setResult(null);
    setError(null);
    setValidation(null);
    setShowJsonView(false);
    setConversionTime(null);
  };

  const convertData = async () => {
    setIsConverting(true);
    setError(null);
    setResult(null);
    setValidation(null);
    setConversionTime(null);

    try {
      const startTime = Date.now();
      const messageType = detectMessageType(hl7Input);

      const response = await fetch(`${API_URL}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': DEMO_API_KEY
        },
        body: JSON.stringify({
          sourceFormat: messageType,
          targetFormat: 'FHIR',
          data: hl7Input
        })
      });

      const data = await response.json();
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      setConversionTime(processingTime);

      if (response.ok && data.success) {
        const fhirData = JSON.parse(data.convertedData);
        setResult(fhirData);
      } else {
        setError(data.errorMessage || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to connect to API: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const performValidation = (fhirData: any): ValidationResult => {
    const issues: any[] = [];
    let isValid = true;

    // Check if it's a valid Bundle
    if (!fhirData.resourceType) {
      issues.push({
        severity: 'error',
        location: 'Bundle',
        details: 'Missing resourceType field'
      });
      isValid = false;
    } else if (fhirData.resourceType !== 'Bundle') {
      issues.push({
        severity: 'warning',
        location: 'Bundle',
        details: `Expected Bundle, got ${fhirData.resourceType}`
      });
    }

    // Check Bundle type
    if (!fhirData.type) {
      issues.push({
        severity: 'warning',
        location: 'Bundle.type',
        details: 'Bundle type is missing'
      });
    }

    // Check Bundle timestamp
    if (!fhirData.timestamp) {
      issues.push({
        severity: 'info',
        location: 'Bundle.timestamp',
        details: 'Bundle timestamp is missing'
      });
    }

    // Check entries
    if (!fhirData.entry || fhirData.entry.length === 0) {
      issues.push({
        severity: 'warning',
        location: 'Bundle.entry',
        details: 'Bundle has no entries'
      });
    } else {
      // Validate each resource in the bundle
      fhirData.entry.forEach((entry: any, index: number) => {
        if (!entry.resource) {
          issues.push({
            severity: 'error',
            location: `Bundle.entry[${index}]`,
            details: 'Entry missing resource'
          });
          isValid = false;
        } else {
          const resource = entry.resource;

          // Check if resource has required fields
          if (!resource.resourceType) {
            issues.push({
              severity: 'error',
              location: `Bundle.entry[${index}].resource`,
              details: 'Resource missing resourceType'
            });
            isValid = false;
          }

          // Resource-specific validation
          if (resource.resourceType === 'Patient') {
            if (!resource.name || resource.name.length === 0) {
              issues.push({
                severity: 'info',
                location: `Patient[${index}].name`,
                details: 'Patient missing name - consider adding for better interoperability'
              });
            }

            if (!resource.identifier || resource.identifier.length === 0) {
              issues.push({
                severity: 'warning',
                location: `Patient[${index}].identifier`,
                details: 'Patient missing identifier - required for patient matching'
              });
            }
          }

          // Check for resource ID
          if (!resource.id) {
            issues.push({
              severity: 'info',
              location: `${resource.resourceType}[${index}].id`,
              details: `${resource.resourceType} missing ID - recommended for resource references`
            });
          }
        }
      });
    }

    // Count issues by severity
    const issueCounts: Record<string, number> = {};
    issues.forEach(issue => {
      issueCounts[issue.severity] = (issueCounts[issue.severity] || 0) + 1;
    });

    // If only warnings/info, still consider valid
    const hasErrors = issues.some(issue => issue.severity === 'error');

    // Create summary message
    let summary;
    if (hasErrors) {
      summary = `Validation failed with ${issues.length} issues`;
    } else if (issues.length === 0) {
      summary = 'Valid FHIR Bundle - no issues found';
    } else {
      const warningCount = issueCounts.warning || 0;
      const infoCount = issueCounts.info || 0;
      if (warningCount > 0 && infoCount > 0) {
        summary = `Valid with ${warningCount} warnings and ${infoCount} recommendations`;
      } else if (warningCount > 0) {
        summary = `Valid with ${warningCount} warning${warningCount > 1 ? 's' : ''}`;
      } else {
        summary = `Valid with ${infoCount} recommendation${infoCount > 1 ? 's' : ''}`;
      }
    }

    return {
      isValid: !hasErrors,
      summary: summary,
      issues: issues,
      issueCounts: issueCounts
    };
  };

  const validateFhir = async () => {
    if (!result) {
      setError('Please convert a message first');
      return;
    }

    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation time
      const validationResult = performValidation(result);
      setValidation(validationResult);
    } catch (err) {
      setError('Validation failed: ' + (err as Error).message);
    } finally {
      setIsValidating(false);
    }
  };

  const downloadFhir = () => {
    if (result) {
      const dataStr = JSON.stringify(result, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'fhir-bundle.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const renderResourceCard = (resource: any) => {
    const getResourceIcon = (type: string) => {
      switch (type) {
        case 'Patient': return <Heart className="w-5 h-5 text-red-500" />;
        case 'Observation': return <Activity className="w-5 h-5 text-blue-500" />;
        case 'DiagnosticReport': return <FileCheck className="w-5 h-5 text-green-500" />;
        case 'ServiceRequest': return <Stethoscope className="w-5 h-5 text-purple-500" />;
        case 'DocumentReference': return <FileCheck className="w-5 h-5 text-orange-500" />;
        case 'MedicationRequest': return '💊';
        case 'Appointment': return '📅';
        case 'Claim': return '💰';
        case 'Organization': return '🏥';
        case 'Practitioner': return '👨‍⚕️';
        case 'Coverage': return '🛡️';
        case 'Encounter': return '🏥';
        case 'ChargeItem': return '💳';
        case 'Invoice': return '🧾';
        case 'Appointment': return '📅';
        case 'Location': return '📍';
        case 'Schedule': return '🗓️';
        case 'PaymentNotice': return '💵';
        case 'ExplanationOfBenefit': return '📋';
        case 'PaymentReconciliation': return '💰';
        case 'CoverageEligibilityRequest': return '🔍';
        case 'CoverageEligibilityResponse': return '✅';
        case 'InsurancePlan': return '🛡️';
        default: return <FileCheck className="w-5 h-5 text-gray-500" />;
      }
    };

    return (
      <div key={resource.id || Math.random()} className="bg-white border border-medical-blue/20 rounded-xl p-6 shadow-medical hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-medical rounded-lg text-white">
              {getResourceIcon(resource.resourceType)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">{resource.resourceType}</h4>
              <p className="text-sm text-muted-foreground">ID: {resource.id || 'Generated'}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs bg-medical-light text-medical-blue border-medical-blue/20">
            FHIR R4
          </Badge>
        </div>

        {/* Resource-specific content */}
        {resource.resourceType === 'Patient' && (
          <div className="space-y-2">
            {resource.name?.[0] && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Name:</span> {resource.name[0].given?.join(' ')} {resource.name[0].family}
              </p>
            )}
            {resource.gender && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Gender:</span> {resource.gender}
              </p>
            )}
            {resource.birthDate && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Birth Date:</span> {resource.birthDate}
              </p>
            )}
          </div>
        )}

        {resource.resourceType === 'Appointment' && (
          <div className="space-y-2">
            {resource.start && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Start:</span> {new Date(resource.start).toLocaleString()}
              </p>
            )}
            {resource.end && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">End:</span> {new Date(resource.end).toLocaleString()}
              </p>
            )}
            {resource.status && (
              <Badge variant={resource.status === 'booked' ? 'default' : 'secondary'} className="text-xs">
                {resource.status}
              </Badge>
            )}
          </div>
        )}

        {resource.resourceType === 'ChargeItem' && (
          <div className="space-y-2">
            {resource.code?.coding?.[0] && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Service:</span> {resource.code.coding[0].display || resource.code.coding[0].code}
              </p>
            )}
            {resource.quantity && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Quantity:</span> {resource.quantity.value}
              </p>
            )}
            {resource.status && (
              <Badge variant={resource.status === 'billable' ? 'default' : 'secondary'} className="text-xs">
                {resource.status}
              </Badge>
            )}
          </div>
        )}

        {resource.resourceType === 'Observation' && (
          <div className="space-y-2">
            {resource.code?.coding?.[0] && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Test:</span> {resource.code.coding[0].display || resource.code.coding[0].code}
              </p>
            )}
            {resource.valueQuantity && (
              <p className="text-sm">
                <span className="font-medium text-medical-blue">Value:</span> {resource.valueQuantity.value} {resource.valueQuantity.unit}
              </p>
            )}
            {resource.status && (
              <Badge variant={resource.status === 'final' ? 'default' : 'secondary'} className="text-xs">
                {resource.status}
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderValidationResults = () => {
    if (!validation) return null;

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'error': return 'text-red-600 bg-red-50 border-red-200';
        case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };

    return (
      <div className="mt-6 p-6 border border-medical-blue/20 rounded-xl bg-gradient-to-r from-medical-light to-white">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-medical-blue" />
          <h4 className="font-semibold text-foreground">FHIR Validation Results</h4>
        </div>
        
        <div className={`p-4 rounded-lg border ${validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-medium ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
              {validation.summary}
            </span>
          </div>
        </div>

        {validation.issues.length > 0 && (
          <div className="mt-4 space-y-2">
            <h5 className="font-medium text-foreground">Issues Found:</h5>
            {validation.issues.map((issue, index) => (
              <div key={index} className={`p-3 rounded-lg border text-sm ${getSeverityColor(issue.severity)}`}>
                <div className="font-medium">{issue.location}</div>
                <div>{issue.details}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-medical-light via-white to-medical-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-medical rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-foreground">
              Live API Demo
            </h3>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience real-time healthcare data conversion with our production API
          </p>
        </div>

        <Card className="shadow-medical border-medical-blue/20 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-medical-blue to-medical-teal text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Play className="w-6 h-6" />
              Interactive Healthcare Data Converter
            </CardTitle>
            <p className="text-white/90 mt-2">
              Convert HL7 and EDI messages to FHIR format using our production API
            </p>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Message Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">
                Select Healthcare Message Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(sampleMessages).map(([key, message]) => (
                  <Button
                    key={key}
                    variant={selectedMessage === key ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center text-center transition-all duration-300 ${
                      selectedMessage === key 
                        ? 'bg-gradient-medical text-white shadow-medical' 
                        : 'hover:shadow-card hover:scale-105'
                    }`}
                    onClick={() => loadSampleMessage(key)}
                  >
                    <span className="text-2xl mb-2">{message.icon}</span>
                    <span className="font-medium text-xs">{key.replace('_', ' ')}</span>
                    <span className="text-xs opacity-80 mt-1">
                      {message.name.split('(')[0].trim()}
                    </span>
                  </Button>
                ))}
              </div>
              
              {selectedMessage && (
                <div className="mt-6 p-6 bg-gradient-to-r from-white to-medical-light rounded-xl border border-medical-blue/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{sampleMessages[selectedMessage].icon}</span>
                    <Badge className={`${sampleMessages[selectedMessage].color} border`}>
                      {sampleMessages[selectedMessage].name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {sampleMessages[selectedMessage].description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">Expected FHIR Resources:</span>
                    <div className="flex flex-wrap gap-1">
                      {sampleMessages[selectedMessage].expectedResources.map((resource, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Healthcare Message Input
              </label>
              <Textarea
                value={hl7Input}
                onChange={(e) => setHL7Input(e.target.value)}
                className="font-mono text-sm min-h-[250px] border-medical-blue/20 focus:border-medical-blue focus:ring-medical-blue/20"
                placeholder="Paste your HL7 or EDI message here, or select a sample above..."
              />
            </div>

            {/* Convert Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={convertData}
                disabled={!hl7Input || isConverting}
                className="bg-gradient-medical hover:shadow-medical hover:scale-105 transition-all duration-300 px-8 py-3"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 mr-2" />
                    Convert to FHIR
                  </>
                )}
              </Button>
              
              {conversionTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Processed in {conversionTime}ms</span>
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        FHIR Bundle Generated Successfully
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {result.entry?.length || 0} FHIR resources created
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={validateFhir}
                      disabled={isValidating}
                      variant="outline"
                      size="sm"
                      className="border-medical-blue text-medical-blue hover:bg-medical-light"
                    >
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileCheck className="w-4 h-4 mr-2" />
                      )}
                      Validate FHIR
                    </Button>
                    <Button
                      onClick={downloadFhir}
                      variant="outline"
                      size="sm"
                      className="border-medical-teal text-medical-teal hover:bg-medical-light"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                    <Button
                      onClick={() => setShowJsonView(!showJsonView)}
                      variant="outline"
                      size="sm"
                      className="border-medical-blue text-medical-blue hover:bg-medical-light"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showJsonView ? 'Card View' : 'JSON View'}
                    </Button>
                  </div>
                </div>

                {showJsonView ? (
                  <div className="bg-slate-900 text-green-400 p-6 rounded-xl overflow-x-auto border border-medical-blue/20">
                    <pre className="text-sm font-mono leading-relaxed">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Bundle Header */}
                    <div className="bg-gradient-to-r from-medical-light to-white border border-medical-blue/20 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-medical rounded-lg">
                            <FileCheck className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground">FHIR Bundle</h4>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-medical-light text-medical-blue border-medical-blue/20">
                            {result.type || 'collection'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.entry?.length || 0} resources
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Resource Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {result.entry?.map((entry: any, index: number) => 
                        entry.resource ? renderResourceCard(entry.resource) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Validation Results */}
                {renderValidationResults()}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-red-800 font-semibold text-lg">Conversion Error</span>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                  <strong>Troubleshooting Tips:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Ensure your message follows the correct HL7 or EDI format</li>
                    <li>Check that all required segments are present</li>
                    <li>Verify field separators and encoding characters</li>
                    <li>Try one of the sample messages to test the API connection</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Demo;