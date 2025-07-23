import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, CheckCircle, AlertCircle } from "lucide-react";

const Demo = () => {
  const [selectedMessage, setSelectedMessage] = useState("ADT");
  const [hl7Input, setHL7Input] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleMessages = {
    ADT: {
      name: "Patient Admission (ADT)",
      description: "Patient demographics and visit information",
      color: "bg-blue-100 text-blue-800",
      data: `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20231215120000||ADT^A01|12345|P|2.5|||AL|NE|
EVN|A01|20231215120000|||
PID|1||123456789|0123456|Doe^John^A||19800315|M||C|123 Main St^^Springfield^IL^62701||555-123-4567|||M|NON|123456789|
PV1|1|I|2000^2012^01||||123456^Smith^John^A|||SUR||||2|A0|`
    },
    ORU: {
      name: "Lab Results (ORU)",
      description: "Laboratory test results with observations",
      color: "bg-green-100 text-green-800",
      data: `MSH|^~\\&|LAB_SYSTEM|LAB_FACILITY|EMR|HOSPITAL|20231215143000||ORU^R01|98765|P|2.5|||AL|NE|
PID|1||987654321|0123456|Smith^Jane^M||19750522|F||C|456 Oak Ave^^Chicago^IL^60601||312-555-8901|||S|NON|987654321|
OBR|1|12345|67890|80061^LIPID PANEL^CPT||20231215090000|20231215093000|||DR^Jones^Sarah|||20231215093000||||||20231215143000|||F|||
OBX|1|NM|13457-7^LDL CHOLESTEROL^LOINC||125|mg/dL|<130|N|||F|||20231215143000|
OBX|2|NM|2093-3^TOTAL CHOLESTEROL^LOINC||200|mg/dL|<200|N|||F|||20231215143000|`
    },
    "EDI_837": {
      name: "EDI 837 Healthcare Claims",
      description: "Professional healthcare claims submission",
      color: "bg-orange-100 text-orange-800",
      data: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
GS*HC*SENDER*RECEIVER*20241122*1430*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*1*20241122*1430*CH~
NM1*41*2*ACME HEALTHCARE*****46*TIN123456789~
CLM*CLAIM001*100.00***11:B:1*Y*A*Y*I~
NM1*71*1*SMITH*JOHN****XX*1234567890~
SV1*HC:99213*75.00*UN*1***1~`
    },
    "EDI_270": {
      name: "EDI 270 Eligibility Inquiry",
      description: "Healthcare eligibility, coverage, or benefits inquiry",
      color: "bg-purple-100 text-purple-800",
      data: `ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *241122*1430*^*00501*000000001*0*T*:~
GS*HS*SENDER*RECEIVER*20241122*1430*1*X*005010X279A1~
ST*270*0001*005010X279A1~
BHT*0022*13*10001234*20241122*1430~
HL*1**20*1~
NM1*PR*2*BLUE CROSS*****PI*12345~
HL*2*1*21*1~
NM1*1P*1*PROVIDER*JOHN****XX*1234567890~
HL*3*2*22*0~
TRN*1*93175-012547*9877281234~
NM1*IL*1*DOE*JANE****MI*123456789~
DMG*D8*19800315*F~
DTP*291*D8*20241122~`
    }
  };

  const loadSampleMessage = (type: string) => {
    setSelectedMessage(type);
    setHL7Input(sampleMessages[type].data);
    setResult(null);
    setError(null);
  };

  const convertData = async () => {
    setIsConverting(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful conversion
      const mockResult = {
        resourceType: "Bundle",
        id: "converted-bundle",
        type: "collection",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              resourceType: "Patient",
              id: "patient-123",
              name: [{ family: "Doe", given: ["John"] }],
              gender: "male",
              birthDate: "1980-03-15"
            }
          }
        ]
      };
      
      setResult(mockResult);
    } catch (err) {
      setError("Conversion failed. Please check your input format.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section id="demo" className="py-20 bg-medical-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Try the API Live
          </h3>
          <p className="text-xl text-muted-foreground">
            Convert healthcare data formats in real-time
          </p>
        </div>

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Interactive Demo
            </CardTitle>
            <p className="text-muted-foreground">
              Select a message type and see the conversion in action
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message Type Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Message Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(sampleMessages).map(([key, message]) => (
                  <Button
                    key={key}
                    variant={selectedMessage === key ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => loadSampleMessage(key)}
                  >
                    <span className="font-medium">{key.replace('_', ' ')}</span>
                    <span className="text-xs opacity-80 text-left">
                      {message.name.split('(')[0].trim()}
                    </span>
                  </Button>
                ))}
              </div>
              
              {selectedMessage && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={sampleMessages[selectedMessage].color}>
                      {sampleMessages[selectedMessage].name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {sampleMessages[selectedMessage].description}
                  </p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Input Message
              </label>
              <Textarea
                value={hl7Input}
                onChange={(e) => setHL7Input(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                placeholder="Paste your HL7 or EDI message here, or select a sample above..."
              />
            </div>

            {/* Convert Button */}
            <Button
              onClick={convertData}
              disabled={!hl7Input || isConverting}
              className="w-full"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to FHIR"
              )}
            </Button>

            {/* Results */}
            {result && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <label className="text-sm font-medium text-foreground">
                    FHIR Bundle Output
                  </label>
                </div>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Conversion Error</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Demo;