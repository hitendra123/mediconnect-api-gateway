import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormatComparison = () => {
  return (
    <section className="py-20 bg-medical-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            See the Transformation
          </h3>
          <p className="text-xl text-muted-foreground">
            From complex HL7 pipes to readable FHIR JSON
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* HL7 Example */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                HL7 v2 Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
{`MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|20231215120000||ADT^A01|12345|P|2.5
PID|1||123456^^^MRN||Doe^John^A||19800315|M|||123 Main St^^Springfield^IL^62701||555-123-4567|
PV1|1|I|2000^2012^01||||123456^Smith^John^A|||SUR||||2|A0|`}
                </pre>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Hard to read</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Pipe-delimited</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Position-based</span>
              </div>
            </CardContent>
          </Card>

          {/* FHIR Example */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                FHIR JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
{`{
  "resourceType": "Patient",
  "id": "123456",
  "identifier": [{
    "use": "official",
    "value": "123456"
  }],
  "name": [{
    "family": "Doe",
    "given": ["John"]
  }],
  "gender": "male",
  "birthDate": "1980-03-15",
  "address": [{
    "line": ["123 Main St"],
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62701"
  }],
  "telecom": [{
    "system": "phone",
    "value": "555-123-4567"
  }]
}`}
                </pre>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Human-readable</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Structured JSON</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Self-documenting</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FormatComparison;